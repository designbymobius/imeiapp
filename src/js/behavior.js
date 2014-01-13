// Namespace
	imeiapp = {},
	
// Variable Declarations
    imeiapp.DOM = {},
    imeiapp.utils = {},
    imeiapp.stats = {},
    imeiapp.animate = {},
    imeiapp.network = {},
    imeiapp.currentInvoice = {},
	imeiapp.storage = window.localStorage;

// Flags
	imeiapp.stats.step = 0;

// Current Invoice
	imeiapp.currentInvoice.invoice = "";
	imeiapp.currentInvoice.imeis = [];

// Pubsub 
	imeiapp.pubsub = pubsub.notification;

// Network Intervals
	imeiapp.network.intervals = {};

// DOM Elements
	imeiapp.DOM["startRegistration"] = document.getElementById("start-registration");
	imeiapp.DOM["cancelRegistration"] = document.getElementsByClassName('restart');
	imeiapp.DOM["connectionIndicator"] = document.getElementsByClassName('connection-indicator');
	imeiapp.DOM["editInvoiceNumber"] = document.getElementsByClassName('editInvoiceNumber');
	imeiapp.DOM["invoiceNumberSlots"] = document.getElementsByClassName('invoiceNumber');
	imeiapp.DOM["IMEIsForReview"] = document.getElementsByClassName('imeiForReview');
	imeiapp.DOM["imeiTallySlots"] = document.getElementsByClassName('imeiTally');
	imeiapp.DOM["editInvoiceAttachments"] = document.getElementsByClassName('editInvoiceAttachments');
	imeiapp.DOM["editSavedIMEIs"] = document.getElementById('editSavedIMEIs');
	imeiapp.DOM["invoice"] = document.getElementById('invoice');
	imeiapp.DOM["IMEI"] = document.getElementById('IMEI');
	imeiapp.DOM["addIMEI"] = document.getElementById('addIMEI');
	imeiapp.DOM["saveIMEI"] = document.getElementById('addIMEItoInvoice');
	imeiapp.DOM["reviewInvoice"] = document.getElementById('reviewInvoice');
	imeiapp.DOM["imeiReviewList"] = document.getElementById('imeiReviewList');
	imeiapp.DOM["completeRegistration"] = document.getElementById('finish-registration');
	imeiapp.DOM["screens"] = document.getElementsByClassName('fullscreen');

// # UTILS

	// SHA-1 Hashing
		imeiapp.utils.sha1 = function(stringToEncode){

            var encode = CryptoJS.SHA1(stringToEncode);

            return encode.toString();
        }

	// UTF-8 Encoding
		imeiapp.utils.utf8 = function (argString) {
			  // From: http://phpjs.org/functions
			  // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
			  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			  // +   improved by: sowberry
			  // +    tweaked by: Jack
			  // +   bugfixed by: Onno Marsman
			  // +   improved by: Yves Sucaet
			  // +   bugfixed by: Onno Marsman
			  // +   bugfixed by: Ulrich
			  // +   bugfixed by: Rafal Kukawski
			  // +   improved by: kirilloid
			  // +   bugfixed by: kirilloid
			  // *     example 1: utf8_encode('Kevin van Zonneveld');
			  // *     returns 1: 'Kevin van Zonneveld'

			  if (argString === null || typeof argString === "undefined") {
			    return "";
			  }

			  var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
			  var utftext = '',
			    start, end, stringl = 0;

			  start = end = 0;
			  stringl = string.length;
			  for (var n = 0; n < stringl; n++) {
			    var c1 = string.charCodeAt(n);
			    var enc = null;

			    if (c1 < 128) {
			      end++;
			    } else if (c1 > 127 && c1 < 2048) {
			      enc = String.fromCharCode(
			         (c1 >> 6)        | 192,
			        ( c1        & 63) | 128
			      );
			    } else if (c1 & 0xF800 != 0xD800) {
			      enc = String.fromCharCode(
			         (c1 >> 12)       | 224,
			        ((c1 >> 6)  & 63) | 128,
			        ( c1        & 63) | 128
			      );
			    } else { // surrogate pairs
			      if (c1 & 0xFC00 != 0xD800) { throw new RangeError("Unmatched trail surrogate at " + n); }
			      var c2 = string.charCodeAt(++n);
			      if (c2 & 0xFC00 != 0xDC00) { throw new RangeError("Unmatched lead surrogate at " + (n-1)); }
			      c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
			      enc = String.fromCharCode(
			         (c1 >> 18)       | 240,
			        ((c1 >> 12) & 63) | 128,
			        ((c1 >> 6)  & 63) | 128,
			        ( c1        & 63) | 128
			      );
			    }
			    if (enc !== null) {
			      if (end > start) {
			        utftext += string.slice(start, end);
			      }
			      utftext += enc;
			      start = end = n + 1;
			    }
			  }

			  if (end > start) {
			    utftext += string.slice(start, stringl);
			  }

			  return utftext;
			}

	// EaseInOut Animation Formula 
		imeiapp.utils.easeInOutQuad = function(t, b, c, d) {
			
			t /= d/2;
			if (t < 1) return c/2*t*t + b;
			t--;
			return -c/2 * (t*(t-2) - 1) + b;
		};

	// Debounce Window Resizes
		imeiapp.utils.onResize = function(c,t){onresize=function(){clearTimeout(t);t=setTimeout(c,250)};return c};

	// Element Has Class 
	    imeiapp.utils.hasClass = function(element, nameOfClass) {

	        return element.className.match(new RegExp('(\\s|^)'+nameOfClass+'(\\s|$)'));
	    }

	// Add Class to Element
	    imeiapp.utils.addClass = function(element, nameOfClass) {
	            
	        if (!imeiapp.utils.hasClass(element, nameOfClass)) {
				
				element.className += " "+nameOfClass;
	        }
	    }

	// Remove Class from Element
	    imeiapp.utils.removeClass = function(element, nameOfClass) {
	            
	        if (imeiapp.utils.hasClass(element,nameOfClass)) {
	            
	            var reg = new RegExp('(\\s|^)'+nameOfClass+'(\\s|$)');
	            element.className=element.className.replace(reg,' ');
	        }
	    }

	// Toggle Class from Element
	    imeiapp.utils.toggleClass = function(element, nameOfClass) {
	        
	        if (imeiapp.utils.hasClass(element,nameOfClass)) {
				
				imeiapp.utils.removeClass(element,nameOfClass);
	        }

	        else {
	        	
				imeiapp.utils.addClass(element,nameOfClass);
	        }
	    }

	// Active Screen Index
		imeiapp.utils.activeScreenIndex = function(){

			var screens = imeiapp.DOM["screens"],
				hasClass = imeiapp.utils.hasClass;

			for (var i = screens.length - 1; i >= 0; i--){
				
				if ( hasClass(screens[i], "active") ){ return i; }
			};
		}

	// App Ready
		imeiapp.utils.launchApp = function() {

            // Shorthand
                var _app = imeiapp;

                var _DOM = _app.DOM,
                    _utils = _app.utils,
                    _pubsub = _app.pubsub,
                    _storage = _app.storage,
                    _network = _app.network;

                var _publish = _pubsub.publish,
                    _registrations = _storage.registrations;			

            // Prep Storage Areas
                if(!_storage.registrations){

                    _utils.createRegistrationStorage();
                }

                if(!_storage.transactions){

                    _utils.createTransactionStorage();
                }

                if(!_storage.archives){

                    _utils.createArchiveStorage();
                }

            // Set Network State
                if(_network.networkState() == "up"){            

                    _publish("network-up", null, this);
                } 
                else {          

                    _publish("network-down", null, this);           
                }

			// Set Screen Sizes
			    _DOM.setScreensHeight();

			// Start at the Beginning
			    _utils.gotoScreen(0);
		}

	// App Upgrade
		imeiapp.utils.cacheReady = function() {		

			alert('App Has Been Updated and will Restart Now');
			window.applicationCache.swapCache();
			location.reload(true);
		}

		imeiapp.utils.cacheDownloading = function(){

			imeiapp.utils.gotoScreen(0);
			imeiapp.utils.deactivateActiveScreen();
			alert("Downloading App Updates - Sorry for the Wait");
		}

    // Create Storage
        imeiapp.utils.createStorage = function(storageAreaName, type){

            var _storage = imeiapp.storage,
                name = storageAreaName,
                type = type || "[]";
            
            // filter
                if ( _storage[storageAreaName] ){ return false; }
            
            // creation
                console.log(" # " + name.toUpperCase() + " DB NOT FOUND\n --> creating it @ imeiapp.storage." + name);
                _storage[storageAreaName] = type;
                return true;
        }

            imeiapp.utils.createTransactionStorage = function(){

                return imeiapp.utils.createStorage('transactions', "{}");
            }

            imeiapp.utils.createRegistrationStorage = function(){

                return imeiapp.utils.createStorage('registrations');
            }

            imeiapp.utils.createArchiveStorage = function(){

                return imeiapp.utils.createStorage('archives', "{}");
            }            

	// Get Storage Utility
        imeiapp.utils.getStorage = function(storageName){

        	var _app = imeiapp;

        	var _s = _app.storage,
        		_u = _app.utils;

        	var storage = _s[storageName];
        	var clean_storage = _u.utf8(storage);

            
            return JSON.parse(clean_storage);
        }

            imeiapp.utils.getRegistrationStorage = function(){ return imeiapp.utils.getStorage('registrations'); }

    		imeiapp.utils.getTransactionStorage = function(){ return imeiapp.utils.getStorage('transactions'); }

    		imeiapp.utils.getArchiveStorage = function(){ return imeiapp.utils.getStorage('archives'); }

    // Save to Storage
        imeiapp.utils.storeRegistration = function(registration){

        	// filter
            	if (Object.prototype.toString.call(registration) != "[object Object]") { return false; }

            // update storage
	            var storage = imeiapp.utils.getRegistrationStorage();
	            storage.push(registration);

	            imeiapp.storage['registrations'] = JSON.stringify(storage);

            return true;
        }

	// Create Transaction
		imeiapp.utils.storeTransaction = function(){

       		// load tools
	            var _u = imeiapp.utils;

	            var sha1 = _u.sha1,
	            	utf8 = _u.utf8,
				    transactions_db = _u.getTransactionStorage();
			
			/* 
			 	HACK TO GET CORRECT ID

				Not entirely sure why normal conversion here creates a different string than elsewhere
				(serverside, imeiapp.utils.pushRegistrations)
				But I get the same results escaping double quotes then wrapping the result in double quotes
			*/
	            var transaction_string = JSON.stringify(_u.getRegistrationStorage());
	            var clean_string = utf8(transaction_string).replace(/"/g, '\\"');
	            var transaction_id = sha1( '"' + clean_string + '"' );

	        // update transactions storage
				transactions_db[transaction_id] = transaction_string;
				imeiapp.storage.transactions = JSON.stringify(transactions_db);

			// reset registrations storage
				delete imeiapp.storage.registrations;
				imeiapp.utils.createRegistrationStorage();	

            return transaction_id;
		}

	// Get Transaction
		imeiapp.utils.getTransaction = function(transaction_id){

			var _u = imeiapp.utils;

			var transaction_store = _u.getTransactionStorage();

			return transaction_store[transaction_id];
		}

	// Archive Transaction
		imeiapp.utils.archiveTransaction = function(transaction_id){

			// filter
				if (!transaction_id){ return false; }

       		// load tools
	            var _u = imeiapp.utils;

	            var archives_db = _u.getArchiveStorage(),
	            	transactions_db = _u.getTransactionStorage();

	        // transfer transaction to archives 
				archives_db[transaction_id] = transactions_db[transaction_id];
				delete transactions_db[transaction_id];

				imeiapp.storage.archives = JSON.stringify(archives_db);
				imeiapp.storage.transactions = JSON.stringify(transactions_db);

            return true;
		}

	// delete from archives
		imeiapp.utils.deleteArchiveEntry = function(transaction_id){

			// filter
				if (!transaction_id){ return false; }

       		// load tools
	            var _u = imeiapp.utils;

	            var archives_db = _u.getArchiveStorage();

	        // transfer transaction to archives
				delete archives_db[transaction_id];
				console.log("deleted transaction #" + transaction_id + " from archives");

				imeiapp.storage.archives = JSON.stringify(archives_db);

            return true;
		}

// # ANIMATION
	
	// ScrollTo
		imeiapp.animate.scrollTo = (function() {
		  
		  var timer, start, factor;
		  
		  return function (target, duration) {
		    var offset = window.pageYOffset,
		        delta  = target - window.pageYOffset; // Y-offset difference
		    duration = duration || 400;              // default 400ms animation
		    start = Date.now();                       // get start time
		    factor = 0;
		    
		    if( timer ) {
		      clearInterval(timer); // stop any running animations
		    }
		    
		    function step() {
		      var y;
		      factor = (Date.now() - start) / duration; // get interpolation factor
		      if( factor >= 1 ) {
		        clearInterval(timer); // stop animation
		        factor = 1;           // clip to max 1.0
		      } 
		      y = factor * delta + offset;

		      window.scrollBy(0, y - window.pageYOffset);
		    }
		    
		    timer = setInterval(step, 10);
		    return timer;
		  };
		}());

// # PUBSUB
	
	// Publish
		// #start-registration -> Start Registration
		    imeiapp.DOM["startRegistration"].addEventListener("click", function(){

		    	imeiapp.pubsub.publish("start-registration", null, this);
		    });

		// #start-registration -> Start Registration
		    imeiapp.DOM["addIMEI"].addEventListener("click", function(){

		    	imeiapp.pubsub.publish("add-imei", null, this);
		    });

		// #saveIMEI -> Save Current IMEI
		    imeiapp.DOM["saveIMEI"].addEventListener("click", function(){

		    	imeiapp.pubsub.publish("save-imei", null, this);
		    });

		// #editSavedIMEIs -> Review IMEIs
		    imeiapp.DOM["editSavedIMEIs"].addEventListener("click", function(){

		    	imeiapp.pubsub.publish("edit-imei", null, this);
		    });

		// #reviewInvoice -> Final Step
		    imeiapp.DOM["reviewInvoice"].addEventListener("click", function(){

		    	imeiapp.pubsub.publish("reviewInvoice", null, this);
		    });

		// #finish-registration -> Save Invoice
		    imeiapp.DOM["completeRegistration"].addEventListener("click", function(){

		    	imeiapp.pubsub.publish("save-registration", null, this);
		    });

		// Recalculate Tally of IMEIs attached to Current Invoice
			imeiapp.utils.savedIMEIsTally = function(){

				imeiapp.pubsub.publish("imei-tally", null, this );
			}

		// Edit -> Review Stored IMEIs
			imeiapp.DOM["editSavedIMEIs"].addEventListener('click', function(){

				for (var i = 0; i < imeiapp.currentInvoice.imeis.length; i++) {
					
					// prep for delete sequence
						var totalOldIMEIs = imeiapp.currentInvoice.imeis.length;

					// process this IMEI
						imeiapp.utils.reviewIMEI(i);

					// if a delete occured, fix index
						if (totalOldIMEIs > imeiapp.currentInvoice.imeis.length){ i = i-1; }
				}


				// Check if any IMEIs are attached 
					if (imeiapp.currentInvoice.imeis.length == 0){

						alert("There are no IMEIs attached to this Invoice");
					}

				// Update IMEI Tally
					imeiapp.utils.savedIMEIsTally();
			});

		// .restart -> Cancel Registration
			for (var i = imeiapp.DOM["cancelRegistration"].length - 1; i >= 0; i--) {
			 	imeiapp.DOM["cancelRegistration"][i].addEventListener("click", function(){

			 		imeiapp.pubsub.publish("cancel-registration", null, this);
			 	});
			 };

		// .editInvoiceNumber -> Step 1
			for (var i = imeiapp.DOM["editInvoiceNumber"].length - 1; i >= 0; i--) {
			 	imeiapp.DOM["editInvoiceNumber"][i].addEventListener("click", function(){

			 		imeiapp.pubsub.publish("edit-invoice", null, this);
			 	});
			 };	

		// .editInvoiceAttachments -> Step 2
			for (var i = imeiapp.DOM["editInvoiceAttachments"].length - 1; i >= 0; i--) {
			 	imeiapp.DOM["editInvoiceAttachments"][i].addEventListener("click", function(){

			 		imeiapp.pubsub.publish("edit-invoice-attachments", null, this);
			 	});
			 };	

		// debounced resize util -> Window Size Change
			imeiapp.utils.onResize(function(){

				imeiapp.pubsub.publish('windowResized', null, this);
			});

	// Subscribe
		// Step 0 -> Start Registration
			imeiapp.pubsub.subscribe(

				'start-registration', 
				'step-0',
				function(){

					imeiapp.utils.gotoScreen(1);
					imeiapp.DOM["invoice"].focus();
				},
				null
			);

		// Step 1 -> Add IMEI
			imeiapp.pubsub.subscribe(

				'add-imei', 
				'step-1',
				function(){

					// Ensure an Invoice Number is Included
						if( !imeiapp.DOM["invoice"].value ){

							alert("An Invoice Number is Needed to Continue");
							
							imeiapp.utils.addClass( imeiapp.DOM["invoice"], "attention" );

							imeiapp.DOM['invoice'].addEventListener('input', function(){

								imeiapp.utils.removeClass( imeiapp.DOM["invoice"], "attention" );
								imeiapp.DOM["invoice"].removeEventListener('input', arguments.callee)
							});

							return;
						}

					// Update Invoice Object
						imeiapp.currentInvoice["invoice"] = imeiapp.DOM["invoice"].value;

					// Update sections that display the Invoice Number 
						for (var i = imeiapp.DOM["invoiceNumberSlots"].length - 1; i >= 0; i--) {
							imeiapp.DOM["invoiceNumberSlots"][i].innerHTML = "#" + imeiapp.DOM["invoice"].value; 
						};

					imeiapp.utils.gotoScreen(2);
					imeiapp.DOM["IMEI"].focus();
				},
				null
			);

		// Save IMEI -> Update JSON
			imeiapp.pubsub.subscribe(

				'save-imei',
				'step-2',
				function(){

					// Don't Save Empty Entries
						if (!imeiapp.DOM['IMEI'].value){

							alert("No IMEI Number to Store");
							
							imeiapp.utils.addClass( imeiapp.DOM["IMEI"], "attention" );

							imeiapp.DOM['IMEI'].addEventListener('input', function(){

								imeiapp.utils.removeClass( this, "attention" );
								this.removeEventListener('input', arguments.callee)
							});

							return;
						}

					// Create IMEI Container for Invoice if it doesn't exist
						if (!imeiapp.currentInvoice.imeis){ imeiapp.currentInvoice.imeis = []; }

					// Save to JSON Object
						imeiapp.currentInvoice.imeis.push(imeiapp.DOM["IMEI"].value);

					// Update User
						alert("'" + imeiapp.DOM["IMEI"].value + "' has been added to Invoice #" + imeiapp.currentInvoice['invoice'] );

					// Broadcast New Tally
						imeiapp.utils.savedIMEIsTally();

					// Cleanup & Fix Focus
						imeiapp.DOM['IMEI'].value = null;
						imeiapp.DOM['IMEI'].focus();

				},
				null
			);

		// Step 2 -> Hide / Show 'Next Step' Button
			imeiapp.pubsub.subscribe(

				'imei-tally',
				'step-2-progress-btn',
				
				function(){

					var btn = imeiapp.DOM['reviewInvoice'];
					var addClass = imeiapp.utils.addClass;
					var removeClass = imeiapp.utils.removeClass;
					var tally = imeiapp.currentInvoice.imeis.length;

					if(tally > 0){ 
						addClass(btn, "active"); 
					}
					
					else { 
						removeClass(btn, "active"); 
					}

				},
				null
			);

		// Step 2 -> Update IMEI Tally Slots
			imeiapp.pubsub.subscribe(

				'imei-tally',
				'tally-slots-updater',
				
				function(){

					var tallySlots = imeiapp.DOM['imeiTallySlots'];
					var tally = imeiapp.currentInvoice.imeis.length;

					for (var i = tallySlots.length - 1; i >= 0; i--) {
						tallySlots[i].innerHTML = tally;
					};

				},
				null
			);

		// Review Invoice -> Step 3
			imeiapp.pubsub.subscribe(

				'reviewInvoice', 
				'step-2',
				function(){

					imeiapp.utils.gotoScreen(3);
				},
				null
			);

		// Save Current Invoice -> Registration Completed
			imeiapp.pubsub.subscribe(

				'save-registration', 
				'final-step',
				function(){

					var storeInvoice = imeiapp.utils.storeRegistration(imeiapp.currentInvoice);

					if(storeInvoice != false){

						imeiapp.pubsub.publish("registration-completed", null, "final-step")
					}
				},
				null
			);

		// Registration Completed -> Prepare for New Registration
			imeiapp.pubsub.subscribe(

				'registration-completed', 
				'reset-app-on-success',
				function(){

					alert("Registration Complete! \n\nApp is Ready to Process a New Registration");
		 			imeiapp.pubsub.publish("cancel-registration", null, "reset-app-on-success");
				},
				null
			);

		// Step 3 -> Update List of IMEIs
			imeiapp.pubsub.subscribe(

				'imei-tally',
				'step-3-imei-list',				
				function(){

					imeiapp.utils.updateListOfIMEIs();
				},
				null
			);

		// Restart -> Cancel Registration
			imeiapp.pubsub.subscribe(

				'cancel-registration', 
				'restartBtn',
				function(){

					// Clear Input Fields
						imeiapp.DOM['invoice'].value = null;
						imeiapp.DOM['IMEI'].value = null;

					// Reset Stored Data
						imeiapp.currentInvoice.invoice = "";
						imeiapp.currentInvoice.imeis = [];
						imeiapp.utils.savedIMEIsTally();

					imeiapp.utils.gotoScreen(0);

				},
				null
			);

		// Edit Invoice -> Step 1
			imeiapp.pubsub.subscribe(

				'edit-invoice', 
				'editInvoiceBtn',
				function(){

					imeiapp.utils.gotoScreen(1);
					imeiapp.DOM['invoice'].select();

				},
				null
			);

		// Edit Invoice Attachments -> Step 2
			imeiapp.pubsub.subscribe(

				'edit-invoice-attachments', 
				'step-3-back-btn',
				function(){

					imeiapp.utils.gotoScreen(2);
					imeiapp.DOM['IMEI'].select();

				},
				null
			);

		// Step 3 Bouncer -> Step 2
			imeiapp.pubsub.subscribe(

				'imei-tally', 
				'step-3-bouncer',
				function(){

					var activeScreen = imeiapp.utils.activeScreenIndex();

					if ( activeScreen == 3 && imeiapp.currentInvoice.imeis.length < 1){

						alert("No IMEIs are currently attached to Invoice #" + imeiapp.currentInvoice.invoice + ". \n\nAdd at least 1 to Proceed");
							
						imeiapp.utils.gotoScreen(2);
						imeiapp.DOM['IMEI'].select();
					}
				},
				null
			);

	    // Set Height on Window Resize
	    	imeiapp.pubsub.subscribe(
	    		'windowResized', 
	    		'windowSizeWatchdog',
	    		function(){

					imeiapp.DOM.setScreensHeight();
				},
				null
				);

	    // Scroll on Resize
	    	imeiapp.pubsub.subscribe(
	    		'screensResized', 
	    		'autoScroller',
	    		function(){

					imeiapp.animate.scrollTo(imeiapp.DOM.screens[imeiapp.stats.step].offsetTop);
				},
				null
				);

	    // Activated Screen Height Fixer
	    	imeiapp.pubsub.subscribe(
	    		'gotToScreen', 
	    		'activeScreenWatchdog',
	    		function(){
	    			
					imeiapp.DOM.setScreensHeight();
				},
				null
				);

// # GENERAL

	// Disable Touch Scrolling
		document.addEventListener('touchmove', function(e){

			e.preventDefault();
		});

	// Enter Key Submits Invoice Number -> Invoice Number Field
		imeiapp.DOM['invoice'].addEventListener('keydown', function(e){

			if (e.keyCode == 13){ imeiapp.DOM['addIMEI'].click(); };
		});

	// Enter Key Saves IMEI -> IMEI Field
		imeiapp.DOM['IMEI'].addEventListener('keydown', function(e){

			if (e.keyCode == 13){ imeiapp.DOM['saveIMEI'].click(); };
		});  

	// Force Screens to Full Window Height
		imeiapp.DOM.setScreensHeight = function(){

			for (var i = imeiapp.DOM.screens.length - 1; i >= 0; i--) {

				if (i < imeiapp.stats.step) { break; }
				
				imeiapp.DOM.screens[i].style.height = window.innerHeight + "px"; 
			};

			imeiapp.pubsub.publish('screensResized', null, 'screenResizer')
		}

    // Deactivate Active Screen
    	imeiapp.utils.deactivateActiveScreen = function(){

    		imeiapp.utils.removeClass( imeiapp.DOM.screens[imeiapp.stats.step], 'active' );
    	}

    // Activate Screen
    	imeiapp.utils.activateScreen = function(screen){ imeiapp.utils.addClass( screen, 'active'); }

    // Go To Screen
    	imeiapp.utils.gotoScreen = function(index, duration){

    		var duration = duration || 400;

    		// Deactivate Current Screen
				imeiapp.utils.deactivateActiveScreen();

			// Set Step
				imeiapp.stats.step = index;

			// Set Screen
				var screen = imeiapp.DOM.screens[imeiapp.stats.step];

			// Activate New Screen
				imeiapp.utils.activateScreen( screen );

			// Scroll to Screen 			
				imeiapp.animate.scrollTo( screen.offsetTop, duration );

				setTimeout(function(){ imeiapp.pubsub.publish("gotToScreen", null, "gotoScreen"); }, duration + 10);
    	}

    // Update IMEI List
    	imeiapp.utils.updateListOfIMEIs = function(){

    		var imeiList = imeiapp.DOM["imeiReviewList"],
    			entries = "";

    		imeiList.innerHTML = "";

    		for (var i = 0; i < imeiapp.currentInvoice.imeis.length; i++) {
    			var entries = entries + "<span class='imeiForReview'>" + imeiapp.currentInvoice.imeis[i] + "</span>" + (i < imeiapp.currentInvoice.imeis.length - 1 ? " | " : "");
    		};

    		imeiList.innerHTML = entries;

    		imeiapp.DOM.activateIMEIsForReview();
    	}

    	imeiapp.utils.reviewIMEI = function(index){

    		if (index < 0){ console.log("no index given to review for reviewIMEI()"); return; }

			// Base Variables				
				var imei = imeiapp.currentInvoice.imeis[index];
				var requestEdit = confirm( "Is this IMEI (" + imei + ") Correct?");
				
				if(requestEdit !== true){

					var oldimei = imei;
					var newimei = prompt("Submit the Correct IMEI to Update or Submit a Blank Field to Delete '" + oldimei + "'", oldimei);

					var replaceIMEI = function(){

						imeiapp.currentInvoice.imeis[index] = newimei;
						alert("'" + oldimei + "' has been replaced with '" + newimei + "'");
					}

					var noChangeAnnouncement = function(){
						
						alert("'" + oldimei + "' has not been changed or deleted");
					}

					var confirmDeleteRequest = function(){

						var requestDelete = confirm("Are you sure you want to delete '" + oldimei + "'?");

						if (requestDelete !== true){

							alert("'" + oldimei + "' has not been deleted or modified");
							return;
						}

						imeiapp.currentInvoice.imeis.splice(index,1);
						alert("'" + oldimei + "' has been deleted");
					}

					if (newimei == oldimei || newimei == null){ noChangeAnnouncement(); }

					else if (newimei == "") { confirmDeleteRequest(); }

					else { replaceIMEI(); }

					imeiapp.utils.savedIMEIsTally();
				} 
    	}

    	imeiapp.DOM.activateIMEIsForReview = function(){

    		var IMEIsForReview = imeiapp.DOM["IMEIsForReview"];

    		for (var i = IMEIsForReview.length - 1; i >= 0; i--) {
    			
    			IMEIsForReview[i].addEventListener("click", function(){

    				var index = i;

    				return function(){
    					imeiapp.utils.reviewIMEI(index);
    				}    				
    			}());
    		};
    	}

    // # APPCACHE
    	if (window.applicationCache){

			window.applicationCache.addEventListener('downloading', imeiapp.utils.cacheDownloading);
			window.applicationCache.addEventListener('updateready', imeiapp.utils.cacheReady);
    	}

    // # NETWORK DETECTION

		// Set Offline.js Options
			Offline.options = {

				checkOnLoad: true,
				interceptRequests: false,
				requests: false,
				checks: {active: 'xhr', xhr: {url: 'server-check.php'}}
			};

		// 
		imeiapp.network.networkState = function(){

			return Offline.state;
		}

		imeiapp.network.checkNetworkState = function(){

			Offline.check();
		}

		imeiapp.network.setOnlineState = function(){
			
			var _utils = imeiapp.utils;
			var body = document.body;

			_utils.removeClass(body, "connection-offline");
			_utils.addClass(body, "connection-online");
		}

		imeiapp.network.setOfflineState = function(){
			
			var _utils = imeiapp.utils;
			var body = document.body;

			_utils.removeClass(body, "connection-online");
			_utils.addClass(body, "connection-offline");
		}

		imeiapp.network.pushRegistrations = function(){

			// required variables & shorthand
				var _i = imeiapp;

	            var _u = _i.utils,
	            	_n = _i.network;

            // turn registrations into a transaction, isolate it then initiate transaction processing
				var create_transaction = _u.storeTransaction(); 

 			// concurrently pushed registrations will retry til transaction list is unlocked
                if (create_transaction == false){

                	setTimeout(
                	
                		function(){

                			if( !imeiapp.storage || !imeiapp.storage.registrations || !JSON.parse(imeiapp.storage.registrations) || JSON.parse(imeiapp.storage.registrations).length < 1 ){ return; }
                			imeiapp.network.pushRegistrations();
                		}, 
                		60000
                	);			
                	
                	return false;
                } 

            // get transaction id
                else {

                	var transaction_id = create_transaction;                	
                }

            // send transaction to server               
                _n.sendTransaction( transaction_id );

            return true;			
		}

	// send transaction to server
		imeiapp.network.sendTransaction = function(transaction_id){

			// filter out improper input
				if( !transaction_id ) { return false; }

			// required variables
				var _publish = imeiapp.pubsub.publish;			
	            var _u = imeiapp.utils;

				var utf8 = _u.utf8;
				var sha1 = _u.sha1;
				var transaction = _u.getTransaction(transaction_id);

	            var transaction_string = JSON.stringify(transaction);
	            var clean_string = utf8(transaction_string);
				var server_trip = new XMLHttpRequest();

			// prepare ajax request to server 
				server_trip.open('POST', location.href + 'process-transaction.php', true);
				server_trip.setRequestHeader("Content-type","application/x-www-form-urlencoded");

			// prepare response
				server_trip.onreadystatechange = function(){

					if (server_trip.readyState==4 && server_trip.status==200){

						_publish(

							"server-acknowledged-transaction",
							{
								server_transaction_id: server_trip.responseText,
								client_transaction_id: transaction_id
							},
							"sendTransaction"
						);
					}
				}

				server_trip.send('t=' + clean_string);

				return true;
		}

	// check status of pending transactions
		imeiapp.network.checkTransactionStatus = function(){

			var _publish = imeiapp.pubsub.publish;			
            var _u = imeiapp.utils;

			var utf8 = _u.utf8;
			var sha1 = _u.sha1;
			var transactions_db = _u.getTransactionStorage();

			var server_trip = new XMLHttpRequest();
			var keys_to_check = [];

			for (var transaction_id in transactions_db) {
			 	
			 	if (!transactions_db.hasOwnProperty(transaction_id)) { continue; }
			    
			 	keys_to_check.push( transaction_id );			  	
			}

				keys_to_check = JSON.stringify( keys_to_check );

				server_trip.open('POST', location.href + 'transaction-status-check.php', true);
				server_trip.setRequestHeader("Content-type","application/x-www-form-urlencoded");
				server_trip.onreadystatechange = function(){

					if (server_trip.readyState==4 && server_trip.status==200){

						var status_updates = JSON.parse(server_trip.responseText);

						_publish(

							"transaction-status-received",
							status_updates,
							"checkTransactionStatus"
						);
					}
				}

				server_trip.send('t=' + keys_to_check);
		}

	// check status of pending transactions
		imeiapp.network.confirmArchivedTransactions = function(){

			var _publish = imeiapp.pubsub.publish;			
            var _u = imeiapp.utils;

			var archives_db = _u.getArchiveStorage();

			var server_trip = new XMLHttpRequest();
			var keys_to_confirm = [];

			for (var transaction_id in archives_db) {
			 	
			 	if (!archives_db.hasOwnProperty(transaction_id)) { continue; }
			    
			 	keys_to_confirm.push( transaction_id );			  	
			}

				keys_to_confirm = JSON.stringify( keys_to_confirm );

				server_trip.open('POST', location.href + 'confirm-transaction.php', true);
				server_trip.setRequestHeader("Content-type","application/x-www-form-urlencoded");
				server_trip.onreadystatechange = function(){

					if (server_trip.readyState==4 && server_trip.status==200){

						var status_updates = JSON.parse(server_trip.responseText);

						_publish(

							"transactions-confirmed",
							status_updates,
							"confirmArchivedTransactions"
						);
					}
				}

				server_trip.send('t=' + keys_to_confirm);
			}

		// log result of send transaction
			imeiapp.pubsub.subscribe(

				"server-acknowledged-transaction",
				"console.log",
				function(metadata){

					var server_id = metadata.notificationParams.server_transaction_id;
					var client_id = metadata.notificationParams.client_transaction_id;

					if (server_id == client_id){

						console.log("server received transaction " + server_id );

					}

					else { 

						console.log("something went wrong: client and server id don't match");
						console.log(metadata.notificationParams);
					}
				},
				null
			);

		imeiapp.pubsub.subscribe(

			"transaction-status-received",
			"process-transaction-status",
			function(metadata){

				var status = metadata.notificationParams;
				var processed_transactions = [];

				for (var transaction_key in status) {
					
					// filter
						if ( !status.hasOwnProperty(transaction_key) ) { continue; }
					
					// transaction key not found
						if ( status[transaction_key] == "false" ){

							imeiapp.network.sendTransaction(transaction_key);
							continue;
						}
					// transaction processed
						if ( status[transaction_key] == "processed" ){

							processed_transactions.push(transaction_key);
							continue;
						}				
				}

				if (processed_transactions.length > 0){
					
					imeiapp.pubsub.publish("transactions-to-archive", processed_transactions, "process-transaction-status");
				}
			},
			null
		);

		imeiapp.pubsub.subscribe(

			"transactions-to-archive",
			"archive-keeper",
			function(metadata){

				var processed_transactions = metadata.notificationParams;

					for (var i = processed_transactions.length - 1; i >= 0; i--) {
						
						// archive transaction
							var archiveTransaction = imeiapp.utils.archiveTransaction( processed_transactions[i] );
							console.log("archive transaction #" + processed_transactions[i] + ": " + archiveTransaction );
					};

					imeiapp.pubsub.publish("transactions-archived", null, "archive-keeper");
			},
			null
		);

		imeiapp.pubsub.subscribe(

			"transactions-archived",
			"confirm-transactions",
			function(){

				var archives_db = imeiapp.utils.getArchiveStorage();

				for (var key in archives_db){

					if ( archives_db.hasOwnProperty(key) ){

						console.log("now confirming transactions on server");
						imeiapp.network.confirmArchivedTransactions();
						break;
					}
				}
			},
			null
		);

		imeiapp.pubsub.subscribe(

			"transactions-confirmed",
			"archive-keeper",
			function(metadata){

				var response = metadata.notificationParams;
				var archives_db = imeiapp.utils.getArchiveStorage();

				console.log("collection of confirmed transactions");
				console.log(response);

				for (var transaction_id in response ){

					if ( response.hasOwnProperty(transaction_id) ){

						imeiapp.utils.deleteArchiveEntry(transaction_id);
					}
				}
			},
			null
		);

		Offline.on("up", function(){

			imeiapp.pubsub.publish("network-up", null, "connection-watchdog");
		});

		Offline.on("down", function(){

			imeiapp.pubsub.publish("network-down", null, "connection-watchdog");
		});

		Offline.on("reconnect:started", function(){

			imeiapp.pubsub.publish("network-reconnecting", null, "connection-watchdog");
		});

		Offline.on("reconnect:stopped", function(){

			imeiapp.pubsub.publish("network-reconnecting-exit", null, "connection-watchdog");
		});

		// Network Status Reconnecting -> Indicator Light Flicker 
			imeiapp.pubsub.subscribe(

				'network-reconnecting', 
				'light-flicker',
				function(){

					var _utils = imeiapp.utils,
						indicators = imeiapp.DOM["connectionIndicator"];
					
					// Flicker Lights while Reconnecting  
						imeiapp.network.checkingLightFlickerInterval = setInterval( function(){				

							for (var i = indicators.length - 1; i >= 0; i--) {
								
								// Orange On
									_utils.addClass(indicators[i], "connection-checking");

								// Orange Off
									setTimeout( function(){

										var count = i;

										return function(){ _utils.removeClass(indicators[count], "connection-checking"); }
									}(), 350);
							};
						}, 2000);

					// Stop Flickering on Reconnect Exit
						imeiapp.pubsub.subscribe(

							'network-reconnecting-exit', 
							'light-flicker',
							function(){

								clearInterval( imeiapp.network.checkingLightFlickerInterval );
								imeiapp.pubsub.unsubscribe('network-reconnecting-exit', 'light-flicker');
							},
							null
						);
				},
				null
			);

		// Network Offline -> Network Online
			imeiapp.pubsub.subscribe(

				'network-up', 
				'online-indicator',
				function(){

					imeiapp.network.setOnlineState();
				},
				null
			);

		// Network Online -> Network Offline
			imeiapp.pubsub.subscribe(

				'network-down', 
				'online-indicator',
				function(){

					imeiapp.network.setOfflineState();
				},
				null
			);

		// Heartbeat -> Network Online
			imeiapp.pubsub.subscribe(

				'network-up', 
				'heartbeat',
				function(){ 
					
					// required vars
					var _n = imeiapp.network,
						_p = imeiapp.pubsub,

						_int = _n.intervals,
						_sub = _p.subscribe,
						_unsub = _p.unsubscribe,

						heartbeat = function(){
							
							_n.checkNetworkState();
						},

						stopHeartbeat = function(){

							clearInterval(_int.heartbeat);
							delete _int.heartbeat;
						};

					// check every 7.5s
						_int.heartbeat = setInterval( heartbeat, 1000 * 7.5);

					// stop heartbeat on disconnect from the internet
						_sub(
							"network-down",
							"heartbeat",
							function(){

								stopHeartbeat();
								_unsub("network-down", "heartbeat");								
							},
							null
						);
				},
				null
			);

		// Transaction -> Check Status on Server
			imeiapp.pubsub.subscribe(

				'network-up', 
				'confirm-transactions',
				function(){

					// reqs
					var _app = imeiapp,
						_n = _app.network,
						_s = _app.storage,
						_p = _app.pubsub,

						_int = _n.intervals,
						_sub = _p.subscribe,
						_unsub = _p.unsubscribe,
						
						confirmArchivedTransactions = function(){						
					
							// filter out bad input
		                        if( !_s || !_s.archives || !JSON.parse(_s.archives) ){ return; }

		                    // check status if transactions db isn't empty
		                    	var archives_db = imeiapp.utils.getArchiveStorage();

			                    for (var key in archives_db){

									if ( archives_db.hasOwnProperty(key) ){

										_n.confirmArchivedTransactions();
										break;
									}
								}
						},

						cancelArchivedTransactionsInterval = function(){

							clearInterval(_int.confirmArchivedTransactions);
							delete _int.confirmArchivedTransactions;
						};

					// confirm now
						confirmArchivedTransactions();

					// confirm every 9 mins: 1000(ms) * 60(s) * 9(m)
						_int.confirmArchivedTransactions = setInterval( confirmArchivedTransactions, 1000 * 60 * 9);

					// cancel interval when network's down
						_sub(

							"network-down",
							"confirm-transactions",
							function(){

								cancelArchivedTransactionsInterval();
								_unsub("network-down","confirm-transactions");
							},
							null
						);
				},
				null
			);

		// Transaction -> Check Status on Server
			imeiapp.pubsub.subscribe(

				'network-up', 
				'check-transaction-status',
				function(){ 

					// reqs
					var _app = imeiapp,
						_p = _app.pubsub,
						_n = _app.network,
						_s = _app.storage,

						_int = _n.intervals,
						_sub = _p.subscribe,
						_unsub = _p.unsubscribe,

						checkTransactionStatus = function(){

							// filter out bad input
		                        if( !_s || !_s.transactions || !JSON.parse(_s.transactions) ){ return; }

		                    // check status if transactions db isn't empty
		                    	var transactions_db = imeiapp.utils.getTransactionStorage();

			                    for (var key in transactions_db){

									if ( transactions_db.hasOwnProperty(key) ){

										_n.checkTransactionStatus();
										break;
									}
								}
						},

						cancelCheckTransactionStatusInterval = function(){

							clearInterval(_int.transactionStatusCheck);
							delete _int.transactionStatusCheck;
						};

					// check now
						checkTransactionStatus();

					// check every 10 mins: 1000(ms) * 60(s) * 10(m)
						_int.transactionStatusCheck = setInterval(checkTransactionStatus, 1000 * 60 * 10);

					// cancel interval when network's down
						_sub(

							"network-down",
							"check-transaction-status",
							function(){

								cancelCheckTransactionStatusInterval();
								_unsub("network-down", "check-transaction-status");
							},
							null
						);
				},
				null
			);

		// Transaction -> Send Registrations to Server
			imeiapp.pubsub.subscribe(

				'network-up', 
				'push-registrations-to-server',
				function(){ 
					
					// reqs
					var _app = imeiapp,
						_p = _app.pubsub,
						_n = _app.network,
						_s = _app.storage,

						_int = _n.intervals,
						_sub = _p.subscribe,
						_unsub = _p.unsubscribe,

						pushRegistrations = function(){

							// filter out bad input
		                        if( !_s || !_s.registrations || !JSON.parse(_s.registrations) || JSON.parse(_s.registrations).length < 1 ){ return; }

							_n.pushRegistrations();
						},

						cancelPushRegistrationsInterval = function(){

							clearInterval(_int.pushRegistrations); 
							delete _int.pushRegistrations; 
						};

					// push now
						pushRegistrations();

					// push every 11m
						_int.pushRegistrations = setInterval( pushRegistrations, 1000 * 60 * 11);

					// clear interval when network's down
						_sub(

							"network-down",
							"push-registrations-to-server",
							function(){

								cancelPushRegistrationsInterval();
								_unsub("network-down","push-registrations-to-server");
							},
							null
						);
				},
				null
			);