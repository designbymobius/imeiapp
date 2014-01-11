<?php

# -----------------------------------------------
# CONSTANTS

	define ("DB_USER", "db122241_mobius");
	define ("DB_PASSWORD", "faB0lous");
	define ("DB_HOST", "internal-db.s122241.gridserver.com");
	
	define ("DB_NAME", "db122241_imeiapp");
	define ("DB_IMEI_TABLE", "imei");
	define ("DB_TRANSACTION_TABLE", "transaction");

# -----------------------------------------------
# DATABASE

	// connect to DB server
		function db_server_connect(){

			$connect = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);

			if (!$connect){ 

				die ("COULDN'T CONNECT TO DB");
			} 

			else {

				return $connect;
			}
		}

	// create imeiDB
		function create_db(){

			$create_db = "CREATE DATABASE " . DB_NAME . " CHARACTER SET utf8 COLLATE utf8_general_ci";

			$success = mysql_query($create_db);

			return $success;
		}

	// create imei table
		function create_imei_table(){
			
			$imei_table = "CREATE TABLE " . DB_IMEI_TABLE . " (
					
				Invoice varchar(250) NOT NULL,
				IMEI varchar(250) NOT NULL
			)";

			$success = mysql_query($imei_table);

			return $success;
		}

	// create transaction table
		function create_transaction_table(){
			
			$transaction_table = "CREATE TABLE " . DB_TRANSACTION_TABLE . " (
					
				Transaction varchar(250) NOT NULL,
				Status varchar(250) NOT NULL,
				PRIMARY KEY (Transaction)
			)";

			$success = mysql_query($transaction_table);

			return $success;
		}

	// store imei
		function store_imei($imei, $invoice){

			if (!$imei){ die("NO IMEI TO STORE"); }
			if (!$invoice){ die("NO INVOICE TO ASSOCIATE THE IMEI WITH"); }

			$mysql_add_imei = "INSERT INTO `" . DB_IMEI_TABLE . "` (`Invoice`, `IMEI`) VALUES ('" . $invoice . "', '" . $imei . "')";

			$result = mysql_query($mysql_add_imei);

			if(!$result){

				echo ("UNABLE TO STORE IMEI <br />");
				die ( mysql_error() );
			}
		}

	// record transaction
		function store_transaction($id){

			if(!$id){ die("NO TRANSACTION ID GIVEN"); }

			$status = "processed";

			$mysql_store_transaction = "INSERT INTO `" . DB_TRANSACTION_TABLE . "` (`Transaction`, `Status`) VALUES ('" . $id . "', '" . $status. "')";

			$result = mysql_query($mysql_store_transaction);

			if(!$result){

				echo ("UNABLE TO STORE TRANSACTION <br />");
				die ( mysql_error() );
			}
		}

	// confirm transaction
		function confirm_transaction($id){

			if(!$id){ die("NO TRANSACTION ID GIVEN"); }

			$status = "confirmed";

			$mysql_confirm_transaction = "UPDATE `" . DB_TRANSACTION_TABLE . "` SET `Status` = '" . $status . "' WHERE `Transaction` = '" . $id . "'";

			$result = mysql_query($mysql_confirm_transaction);

			if(!$result){

				echo ("UNABLE TO CONFIRM TRANSACTION <br />");
				die ( mysql_error() );
			} 

			else {

				return $status;
			}
		}

	// get transaction
		function get_transaction($id){

			if(!$id){ die("NO TRANSACTION ID GIVEN"); }

			$mysql_get_transaction = "SELECT * FROM `" . DB_TRANSACTION_TABLE . "` WHERE `Transaction` = '" . $id . "' LIMIT 1";

			$get_transaction = mysql_query( $mysql_get_transaction );

			if ( mysql_num_rows($get_transaction) == 0 ){ return false; }

			while ( $transaction = mysql_fetch_assoc($get_transaction) ){
				
				return $transaction;
			}
		}

	// get transaction status
		function get_transaction_status($id){

			$transaction = get_transaction($id);
			
			$status = ( $transaction == false ? "false" : $transaction['Status']);

			return $status;
		}

# ----------------------------------------------- 
# UTILS

	// Get sha1 value of string 
		function get_hashsum($string){

			
			$clean_string = utf8_encode($string);
			$hashsum = sha1($clean_string);

			return $hashsum;
		}
?>