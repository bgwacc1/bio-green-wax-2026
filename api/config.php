<?php
/**
 * Database Configuration for Ionos Hosting
 * 
 * Update these values with your Ionos MySQL database credentials.
 * You can find these in your Ionos Control Panel under:
 * Hosting > MySQL Databases
 */

// Database Configuration
define('MYSQL_HOST', 'localhost'); // Your Ionos database host
define('MYSQL_USER', 'u662768582_bgw');          // Your database username
define('MYSQL_PASSWORD', 'RZYAQ+3QL1g;');  // Your database password
define('MYSQL_DATABASE', 'u662768582_bgw');      // Your database name

// JWT Secret - Change this to a random secure string
define('JWT_SECRET', 'change-this-to-a-very-long-random-string-for-security');

// Error reporting (set to 0 for production)
error_reporting(0);
ini_set('display_errors', 0);
