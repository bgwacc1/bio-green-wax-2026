import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Languages, RefreshCw, CheckCircle2, AlertCircle, Loader2, StopCircle } from "lucide-react";

interface ContentToTranslate {
  type: string;
  id: string;
  name: string;
  fields: string[];
  missingCount?: number;
  languageCount?: number;
}

interface TranslationProgress {
  total: number;
  completed: number;
  remaining: number;
  current: string;
  entityType: string;
  entityName: string;
  languageCode: string;
  languageName: string;
  languageFlag: string;
  errors: string[];
  batchNumber: number;
  remainingAfterBatch: number;
  totalProcessed: number;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
];

const TYPE_LABELS: Record<string, string> = {
  product: 'Products',
  category: 'Product Categories',
  sector: 'Sectors',
  certification: 'Certifications',
  news: 'News Articles',
  job: 'Job Openings',
  hero_slide: 'Hero Slides',
  director: 'Directors',
  global_operation: 'Global Operations',
  about_content: 'About Us Content',
  contact_info: 'Contact Info',
};

const STORAGE_KEY = 'translation_sync_state';

function loadPersistedState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function persistState(state: {
  progress: TranslationProgress | null;
  lastSyncTime: string | null;
  contentToTranslate: ContentToTranslate[];
  totalMissingTranslations: number;
  selectedItems: string[];
  isSyncing: boolean;
}) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

const TranslationSyncManager = () => {
  const { toast } = useToast();
  const persisted = useRef(loadPersistedState());
  const [isScanning, setIsScanning] = useState(false);
  const [isSyncing, setIsSyncing] = useState(persisted.current?.isSyncing ?? false);
  const [contentToTranslate, setContentToTranslate] = useState<ContentToTranslate[]>(persisted.current?.contentToTranslate ?? []);
  const [totalMissingTranslations, setTotalMissingTranslations] = useState(persisted.current?.totalMissingTranslations ?? 0);
  const [progress, setProgress] = useState<TranslationProgress | null>(persisted.current?.progress ?? null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(persisted.current?.lastSyncTime ?? null);
  const [isStopping, setIsStopping] = useState(false);
  const stopRequestedRef = useRef(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(persisted.current?.selectedItems ?? []));

  const groupedContent = useMemo(() => {
    const groups: Record<string, ContentToTranslate[]> = {};
    for (const item of contentToTranslate) {
      if (!groups[item.type]) groups[item.type] = [];
      groups[item.type].push(item);
    }
    return groups;
  }, [contentToTranslate]);

  const toggleItem = (type: string, id: string) => {
    const key = `${type}:${id}`;
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleGroup = (type: string) => {
    const groupItems = groupedContent[type] || [];
    const groupKeys = groupItems.map(i => `${i.type}:${i.id}`);
    const allSelected = groupKeys.every(k => selectedItems.has(k));
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (allSelected) {
        groupKeys.forEach(k => next.delete(k));
      } else {
        groupKeys.forEach(k => next.add(k));
      }
      return next;
    });
  };

  const selectAll = () => {
    const all = contentToTranslate.map(i => `${i.type}:${i.id}`);
    setSelectedItems(new Set(all));
  };

  const deselectAll = () => {
    setSelectedItems(new Set());
  };

  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    persistTimerRef.current = setTimeout(() => {
      persistState({
        progress,
        lastSyncTime,
        contentToTranslate,
        totalMissingTranslations,
        selectedItems: Array.from(selectedItems),
        isSyncing,
      });
      persistTimerRef.current = null;
    }, 1000);
    return () => {
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    };
  }, [progress, lastSyncTime, contentToTranslate, totalMissingTranslations, selectedItems, isSyncing]);


  const selectedCount = selectedItems.size;
  const selectedTranslationCount = useMemo(() => {
    let count = 0;
    for (const item of contentToTranslate) {
      if (selectedItems.has(`${item.type}:${item.id}`)) {
        count += item.languageCount || 15;
      }
    }
    return count;
  }, [selectedItems, contentToTranslate]);

  const getAuthHeaders = useCallback(() => {
    const token = sessionStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }, []);

  const isSyncingRef = useRef(isSyncing);
  useEffect(() => { isSyncingRef.current = isSyncing; }, [isSyncing]);
  const lastPollDataRef = useRef<string>('');
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);
  const pendingItemsFilterRef = useRef<string[] | null>(null);

  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) return;
    const poll = async () => {
      if (!mountedRef.current) return;
      try {
        const response = await fetch('/api/sync/status');
        if (!response.ok || !mountedRef.current) return;
        const data = await response.json();
        if (!mountedRef.current) return;

        if (data.inProgress) {
          if (!isSyncingRef.current) {
            setIsSyncing(true);
          }
          const dataKey = `${data.completed}:${data.current}:${data.languageCode}`;
          if (dataKey !== lastPollDataRef.current) {
            lastPollDataRef.current = dataKey;

            if (data.batchComplete && data.hasMore && !data.stopped) {
              setProgress(prev => ({
                ...prev!,
                total: data.total ?? prev?.total ?? 0,
                completed: data.batchCompleted ?? data.completed ?? 0,
                remaining: 0,
                current: `Batch complete! Starting next batch (${data.remainingItems ?? data.remainingAfterBatch ?? 0} items remaining)...`,
                remainingAfterBatch: data.remainingItems ?? data.remainingAfterBatch ?? 0,
              }));
              const token = localStorage.getItem('auth_token');
              fetch('/api/sync/translate', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token ? `Bearer ${token}` : '',
                },
                body: pendingItemsFilterRef.current ? JSON.stringify({ selectedItems: pendingItemsFilterRef.current }) : null,
              }).catch(() => {});
            } else if (data.stopped) {
              setProgress(prev => ({
                ...prev!,
                current: data.current || 'Sync stopped by user.',
              }));
            } else {
              setProgress({
                total: data.total ?? 0,
                completed: data.completed ?? 0,
                remaining: data.remaining ?? 0,
                current: data.current || 'Translation in progress...',
                entityType: data.entityType || '',
                entityName: data.entityName || '',
                languageCode: data.languageCode || '',
                languageName: data.languageName || '',
                languageFlag: data.languageFlag || '',
                errors: data.error ? [data.error] : [],
                batchNumber: data.batchNumber ?? 1,
                remainingAfterBatch: data.remainingAfterBatch ?? 0,
                totalProcessed: data.totalProcessed ?? 0,
              });
            }
          }
        } else {
          if (isSyncingRef.current) {
            setIsSyncing(false);
            setIsStopping(false);
            stopRequestedRef.current = false;
            lastPollDataRef.current = '';
            pendingItemsFilterRef.current = null;
            setLastSyncTime(new Date().toLocaleString());
            setProgress(prev => prev ? ({
              ...prev,
              current: 'Translation sync complete!',
              remaining: 0,
            }) : null);
            try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
          }
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
        }
      } catch {}
    };
    poll();
    pollIntervalRef.current = setInterval(poll, 2000);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const checkOnce = async () => {
      try {
        const response = await fetch('/api/sync/status');
        if (!response.ok || !mountedRef.current) return;
        const data = await response.json();
        if (data.inProgress) {
          setIsSyncing(true);
          startPolling();
        } else if (isSyncingRef.current) {
          setIsSyncing(false);
          setIsStopping(false);
          stopRequestedRef.current = false;
          lastPollDataRef.current = '';
          pendingItemsFilterRef.current = null;
          if (progress && progress.completed > 0) {
            setLastSyncTime(new Date().toLocaleString());
            setProgress(prev => prev ? ({
              ...prev,
              current: 'Translation sync complete!',
              remaining: 0,
            }) : null);
          } else {
            setProgress(null);
          }
          try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
        }
      } catch {}
    };
    checkOnce();
    return () => {
      mountedRef.current = false;
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [startPolling]);

  const scanForUntranslatedContent = async () => {
    setIsScanning(true);
    try {
      const response = await fetch('/api/sync/scan', {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to scan content');
      const data = await response.json();
      const items: ContentToTranslate[] = data.items || [];
      setContentToTranslate(items);
      setTotalMissingTranslations(data.totalMissingTranslations || 0);
      setSelectedItems(new Set(items.map((i: ContentToTranslate) => `${i.type}:${i.id}`)));
      const msg = data.totalMissingTranslations > 0 
        ? `Found ${items.length} items with ${data.totalMissingTranslations} missing translations.`
        : 'All content is already translated!';
      toast({
        title: "Scan Complete",
        description: msg,
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Could not scan for untranslated content.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const stopSync = useCallback(async () => {
    stopRequestedRef.current = true;
    setIsStopping(true);
    setProgress(prev => prev ? ({
      ...prev,
      current: 'Stopping after current item completes... All completed translations are saved.',
    }) : null);
    try {
      const token = localStorage.getItem('auth_token');
      await fetch('/api/sync/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
    } catch {}
  }, []);

  const syncTranslations = async () => {
    if (selectedItems.size === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select at least one item to translate.",
        variant: "destructive",
      });
      return;
    }

    stopRequestedRef.current = false;
    setIsSyncing(true);
    const itemsFilter = Array.from(selectedItems);
    pendingItemsFilterRef.current = itemsFilter;
    setProgress({ 
      total: 0, 
      completed: 0, 
      remaining: 0,
      current: `Starting translation of ${selectedItems.size} selected items...`, 
      entityType: '',
      entityName: '',
      languageCode: '',
      languageName: '',
      languageFlag: '',
      errors: [],
      batchNumber: 1,
      remainingAfterBatch: 0,
      totalProcessed: 0
    });

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/sync/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ selectedItems: itemsFilter }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to start translation sync');
      }

      startPolling();
    } catch (error: any) {
      const errorMessage = error?.message || "Unknown error occurred";
      setProgress(prev => prev ? ({
        ...prev,
        current: `Translation failed to start: ${errorMessage}`,
        errors: [...(prev.errors || []), errorMessage],
      }) : null);
      toast({
        title: "Translation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSyncing(false);
    }
  };

  const progressPercent = progress?.total ? (progress.completed / progress.total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Translation Synchronization
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Automatically translate English content to all 16 supported languages using AI.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg text-black">Supported Languages</CardTitle>
            <CardDescription className="text-black/70">Content will be translated to these languages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_LANGUAGES.map(lang => (
                <Badge key={lang.code} variant={lang.code === 'en' ? 'default' : 'secondary'}>
                  {lang.flag} {lang.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg text-black">Sync Status</CardTitle>
            <CardDescription className="text-black/70">Last synchronization status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {lastSyncTime ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Last synced: {lastSyncTime}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">No sync performed yet</span>
                  </>
                )}
              </div>
              {contentToTranslate.length > 0 && (
                <p className="text-sm text-orange-600">
                  {contentToTranslate.length} items with {totalMissingTranslations} missing translations
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Synchronize Translations</CardTitle>
          <CardDescription>
            Scan for new or updated English content and automatically translate to all languages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={scanForUntranslatedContent}
              disabled={isScanning || isSyncing}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Scan for Changes
                </>
              )}
            </Button>

            <Button
              onClick={syncTranslations}
              disabled={isSyncing || isScanning || selectedCount === 0}
              className="bg-primary hover:bg-primary/90"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Languages className="mr-2 h-4 w-4" />
                  {selectedCount > 0
                    ? `Translate Selected (${selectedCount} items)`
                    : 'Synchronize Data in All Languages'}
                </>
              )}
            </Button>

            {isSyncing && (
              <Button
                onClick={stopSync}
                disabled={isStopping}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                {isStopping ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Stopping...
                  </>
                ) : (
                  <>
                    <StopCircle className="mr-2 h-4 w-4" />
                    Stop Translation
                  </>
                )}
              </Button>
            )}
          </div>

          {isSyncing && progress && (
            <div className="space-y-4 pt-4 border-t">
              <div className="bg-indigo-50 rounded-lg p-3 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo-700">
                    Batch {progress.batchNumber} of ~{Math.ceil((progress.remainingAfterBatch + 10) / 10)}
                  </span>
                  {progress.remainingAfterBatch > 0 && (
                    <span className="text-xs text-indigo-600">
                      {progress.remainingAfterBatch} items remaining after this batch
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">{progress.completed}</div>
                  <div className="text-xs text-blue-600/70">Batch Progress</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-orange-600">{progress.remaining || (progress.total - progress.completed)}</div>
                  <div className="text-xs text-orange-600/70">Batch Remaining</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">{progress.total}</div>
                  <div className="text-xs text-green-600/70">Batch Total</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-600">{Math.round(progressPercent)}%</div>
                  <div className="text-xs text-purple-600/70">Batch %</div>
                </div>
              </div>
              
              <Progress value={progressPercent} className="h-3" />
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="text-sm font-medium text-gray-700">Currently Translating:</div>
                <div className="flex items-center gap-3">
                  {progress.languageFlag && (
                    <span className="text-2xl">{progress.languageFlag}</span>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {progress.entityName || 'Processing...'}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      {progress.entityType && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {progress.entityType.replace(/_/g, ' ')}
                        </Badge>
                      )}
                      {progress.languageName && (
                        <span>to {progress.languageName}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {progress.errors.length > 0 && (
                <div className="mt-2 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-sm font-semibold text-red-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {progress.errors.length} error(s) occurred during translation
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    Items that failed will not be marked as synchronized and will be retried automatically on the next sync.
                  </p>
                  <div className="text-xs text-red-500 mt-2 max-h-32 overflow-y-auto space-y-1">
                    {progress.errors.slice(-5).map((err, i) => (
                      <div key={i} className="bg-red-100 rounded p-2">{err}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {contentToTranslate.length > 0 && !isSyncing && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">
                  Content to Translate ({totalMissingTranslations} missing translations)
                  {selectedCount > 0 && (
                    <span className="text-primary ml-2">
                      — {selectedCount} selected ({selectedTranslationCount} translations)
                    </span>
                  )}
                </h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAll} className="text-xs h-7">
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={deselectAll} className="text-xs h-7">
                    Deselect All
                  </Button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto space-y-4">
                {Object.entries(groupedContent).map(([type, items]) => {
                  const groupKeys = items.map(i => `${i.type}:${i.id}`);
                  const allGroupSelected = groupKeys.every(k => selectedItems.has(k));
                  const someGroupSelected = groupKeys.some(k => selectedItems.has(k));
                  return (
                    <div key={type} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Checkbox
                          checked={allGroupSelected ? true : someGroupSelected ? "indeterminate" : false}
                          onCheckedChange={() => toggleGroup(type)}
                        />
                        <span className="text-sm font-semibold">{TYPE_LABELS[type] || type}</span>
                        <Badge variant="secondary" className="text-xs">{items.length} items</Badge>
                      </div>
                      <div className="ml-6 space-y-1">
                        {items.map((item) => {
                          const key = `${item.type}:${item.id}`;
                          return (
                            <div key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Checkbox
                                checked={selectedItems.has(key)}
                                onCheckedChange={() => toggleItem(item.type, item.id)}
                              />
                              <span className="flex-1 truncate">{item.name}</span>
                              {item.languageCount && (
                                <Badge variant="outline" className="text-xs">{item.languageCount} langs</Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <p className="text-sm text-blue-800">
            <strong>How it works:</strong> Click "Scan for Changes" to find content that needs translating. 
            Use the checkboxes to select which items you want to translate — you can select individual items, 
            entire categories, or use Select All / Deselect All. Then click "Translate Selected" to start. 
            <strong>Processing is done in batches of 10 items at a time</strong> to prevent timeouts. 
            Translations are stored in the database and automatically displayed when visitors browse 
            in their preferred language.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationSyncManager;
