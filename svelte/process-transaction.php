<?php

	if( !$_POST || !$_POST['t'] ){ die("FORGOT TO SEND A TRANSACTION, DID YOU?"); }

	require_once('utils.php');

	// required variables
		$connection = db_server_connect();
		$transaction_id = get_hashsum($_POST['t']);
		$transaction = json_decode( json_decode($_POST['t']) );

	// get DB
		mysql_select_db(DB_NAME, $connection);

	// filter
		if(get_transaction($transaction_id)){ die("TRANSACTION ALREADY PROCESSED"); }

	// store imeis
		foreach ($transaction as $registration) {

			$invoice = $registration->invoice;
			$imeis = $registration->imeis;

			foreach ($imeis as $imei) {
				
				store_imei($imei, $invoice);
			}
		}	

	// store transaction
		store_transaction($transaction_id);

	// close db connection	
		mysql_close($connection);
	
	echo( $transaction_id );
?>