<?php
	
	require_once("utils.php");
	
	// required variables
		$connection = db_server_connect();
		
		$db_exists = mysql_select_db(DB_NAME, $connection);
		$imei_table_exists = mysql_query('select 1 from `' . DB_IMEI_TABLE . '`');
		$transaction_table_exists = mysql_query('select 1 from `' . DB_TRANSACTION_TABLE . '`');

	// check for DB
		if(!$db_exists){ 
			
			$create_db = create_db();

			if (!$create_db){ echo "DB CREATION QUERY FAILED <br />"; } 
			else { echo "DB CREATED <br />"; }
		}

		else { echo "DB ALREADY EXISTS <br />"; }

	// check for imei table
		if(!$imei_table_exists){ 

			$create_imei_table = create_imei_table();

			if (!$create_imei_table){ echo "IMEI TABLE CREATION QUERY FAILED <br />"; } 
			else { echo "IMEI TABLE CREATED <br />"; }
		} 

		else { echo "IMEI TABLE ALREADY EXISTS <br />"; }

	// create transaction table
		if(!$transaction_table_exists){ 

			$create_transaction_table = create_transaction_table();

			if (!$create_transaction_table){ echo "TRANSACTION TABLE CREATION QUERY FAILED <br />"; } 
			else { echo "TRANSACTION TABLE CREATED <br />"; }
		}

		else { "TRANSACTION TABLE ALREADY EXISTS <br />"; }

	mysql_close($connection);
?>