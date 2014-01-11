<?php	

	if( !$_POST || !$_POST['t'] ){ die("FORGOT TO SEND A LIST OF TRANSACTIONS TO CHECK, DID YOU?"); }

	require_once('utils.php');

	// required variables
		$response = array();
		$connection = db_server_connect();
		$transaction_array = json_decode($_POST['t']);

	// connect to db	
		mysql_select_db(DB_NAME, $connection);

	// get transaction status of keys sent
		foreach ($transaction_array as $transaction_key) {
			
			$status = get_transaction_status($transaction_key);

			$response[$transaction_key] = $status;
		}

	// close db connection
		mysql_close($connection);

		echo( json_encode($response) );
?>