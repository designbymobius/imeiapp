// Namespace
    imeiapp = {};
    
// Variable Declarations
    imeiapp.ui = {},
    imeiapp.DOM = {},
    imeiapp.utils = {},
    imeiapp.stats = {},
    imeiapp.animate = {},
    imeiapp.network = {},
    imeiapp.currentInvoice = {},

// Flags
    imeiapp.stats.step = 0,

// Current Invoice
    imeiapp.currentInvoice.invoice = "",
    imeiapp.currentInvoice.imeis = [],

// Pubsub 
    imeiapp.pubsub = pubsub.notification,

// Network Intervals
    imeiapp.network.intervals = {};

// DOM Elements
    imeiapp.DOM.backBtn = document.getElementsByClassName('previousStep');
    imeiapp.DOM.nextBtn = document.getElementsByClassName('nextStep');
    imeiapp.DOM.startRegistration = document.getElementById("start-registration");
    imeiapp.DOM.cancelRegistration = document.getElementsByClassName('restart');
    imeiapp.DOM.connectionIndicator = document.getElementsByClassName('connection-indicator');
    imeiapp.DOM.invoiceNumberSlots = document.getElementsByClassName('invoiceNumber');
    imeiapp.DOM.IMEIsForReview = document.getElementsByClassName('imeiForReview');
    imeiapp.DOM.imeiTallySlots = document.getElementsByClassName('imeiTally');
    imeiapp.DOM.editSavedIMEIs = document.getElementById('editSavedIMEIs');
    imeiapp.DOM.invoice = document.getElementById('invoice');
    imeiapp.DOM.IMEI = document.getElementById('IMEI');
    imeiapp.DOM.saveIMEI = document.getElementById('addIMEItoInvoice');
    imeiapp.DOM.imeiReviewList = document.getElementById('imeiReviewList');
    imeiapp.DOM.completeRegistration = document.getElementById('finish-registration');
    imeiapp.DOM.screens = document.getElementsByClassName('fullscreen');

// # UI
    
    // Fade Out Screen
        imeiapp.ui.activateScreen = function(index){

            // req vars
            var _app = imeiapp,
                
                _screens = _app.DOM.screens,             
                _addClass = _app.utils.addClass;

            // activate
                _addClass( _screens[ index ], "active" );
        };

    // Deactivate Active Screen
        imeiapp.ui.deactivateScreen = function(index){

            // req vars
            var _app = imeiapp,
                            
                _screens = _app.DOM.screens,             
                _removeClass = _app.utils.removeClass;

            // activate
                _removeClass( _screens[ index ], "active" );
        };

// # UTILS

    // SHA-1 Hashing
        imeiapp.utils.sha1 = function(stringToEncode){

            var encode = CryptoJS.SHA1(stringToEncode);

            return encode.toString();
        };

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
        };

    // EaseInOut Animation Formula 
        imeiapp.utils.easeInOutQuad = function(t, b, c, d) {
            
            t /= d/2;
            if (t < 1) return c/2*t*t + b;
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        };

    // Debounce Window Resizes
        imeiapp.utils.onResize = function(c,t){onresize=function(){clearTimeout(t);t=setTimeout(c,250)};return c}

    // Element Has Class 
        imeiapp.utils.hasClass = function(element, nameOfClass) {

            return element.className.match(new RegExp('(\\s|^)'+nameOfClass+'(\\s|$)'));
        };

    // Add Class to Element
        imeiapp.utils.addClass = function(element, nameOfClass) {
                
            if (!imeiapp.utils.hasClass(element, nameOfClass)) {
                
                element.className += " "+nameOfClass;
            }
        };

    // Remove Class from Element
        imeiapp.utils.removeClass = function(element, nameOfClass) {
                
            if (imeiapp.utils.hasClass(element,nameOfClass)) {
                
                var reg = new RegExp('(\\s|^)'+nameOfClass+'(\\s|$)');
                element.className=element.className.replace(reg,' ');
            }
        };

    // Toggle Class from Element
        imeiapp.utils.toggleClass = function(element, nameOfClass) {
            
            if (imeiapp.utils.hasClass(element,nameOfClass)) {
                
                imeiapp.utils.removeClass(element,nameOfClass);
            }

            else {
                
                imeiapp.utils.addClass(element,nameOfClass);
            }
        };

    // App Ready
        imeiapp.utils.launchApp = function() {

            // Shorthand
                var _app = imeiapp;

                var _DOM = _app.DOM,
                    _utils = _app.utils,
                    _pubsub = _app.pubsub,
                    _network = _app.network;

                var _publish = _pubsub.publish;            

            // Prep Storage Areas
                if( !window.localStorage.registrations ){

                    _utils.createRegistrationStorage();
                }

                if( !window.localStorage.transactions ){

                    _utils.createTransactionStorage();
                }

                if( !window.localStorage.archives ){

                    _utils.createArchiveStorage();
                }

            // Set Network State
                if(_network.networkState() === "up"){            

                    _publish("network-up", null, this);
                } 
                else {          

                    _publish("network-down", null, this);           
                }

            // Set Screen Sizes
                _utils.setScreensHeight();

            // Start at the Beginning
                _utils.gotoScreen(0);
        };

    // App Upgrade
        imeiapp.utils.cacheReady = function() {     

            alert('App Has Been Updated and will Restart Now');
            window.applicationCache.swapCache();
            location.reload(true);
        };

        imeiapp.utils.cacheDownloading = function(){

            imeiapp.utils.gotoScreen(0);
            imeiapp.utils.deactivateActiveScreen();
            alert("Downloading App Updates - Sorry for the Wait");
        };

    // Create Storage
        imeiapp.utils.createStorage = function(storageAreaName, type){

            // req vars
                type = type || "[]";
            
            // filter
                if ( window.localStorage[storageAreaName] ){ return false; }
            
            // creation
                window.localStorage[storageAreaName] = type;
                return true;
        };

            imeiapp.utils.createTransactionStorage = function(){

                return imeiapp.utils.createStorage('transactions', "{}");
            };

            imeiapp.utils.createRegistrationStorage = function(){

                return imeiapp.utils.createStorage('registrations');
            };

            imeiapp.utils.createArchiveStorage = function(){

                return imeiapp.utils.createStorage('archives', "{}");
            };         

    // Get Storage Utility
        imeiapp.utils.getStorage = function(storageName){

            var _app = imeiapp;

            var _s = window.localStorage,
                _u = _app.utils;

            var storage = _s[storageName];
            var clean_storage = _u.utf8(storage);

            
            return JSON.parse(clean_storage);
        };

            imeiapp.utils.getRegistrationStorage = function(){ return imeiapp.utils.getStorage('registrations'); };

            imeiapp.utils.getTransactionStorage = function(){ return imeiapp.utils.getStorage('transactions'); };

            imeiapp.utils.getArchiveStorage = function(){ return imeiapp.utils.getStorage('archives'); };

    // Save to Storage
        imeiapp.utils.storeRegistration = function(registration){

            // filter
                if (Object.prototype.toString.call(registration) !== "[object Object]") { return false; }

            // update storage
                var storage = imeiapp.utils.getRegistrationStorage();
                storage.push(registration);

            // commit changes
                window.localStorage.registrations = JSON.stringify(storage);

            return true;
        };

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
                window.localStorage.transactions = JSON.stringify(transactions_db);

            // reset registrations storage
                delete window.localStorage.registrations;
                imeiapp.utils.createRegistrationStorage();

            return transaction_id;
        };

    // Get Transaction
        imeiapp.utils.getTransaction = function(transaction_id){

            var _u = imeiapp.utils;

            var transaction_store = _u.getTransactionStorage();

            return transaction_store[transaction_id];
        };

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

            // commit
                window.localStorage.transactions = JSON.stringify(transactions_db);
                window.localStorage.archives = JSON.stringify(archives_db);

            return true;
        };

    // delete from archives
        imeiapp.utils.deleteArchiveEntry = function(transaction_id){

            // filter
                if (!transaction_id){ return false; }

            // req vars
                var _u = imeiapp.utils,
                    archives_db = _u.getArchiveStorage();

            // transfer transaction to archives
                delete archives_db[transaction_id];

            // commit
                window.localStorage.archives = JSON.stringify(archives_db);

            // log
                console.log("deleted transaction #" + transaction_id + " from archives");

            return true;
        };

    // Deactivate Active Screen
        imeiapp.utils.deactivateActiveScreen = function(){

            imeiapp.pubsub.publish( "screen-teardown", null, this);
        };

    // Activate Screen
        imeiapp.utils.activateScreen = function(index){ 

            imeiapp.pubsub.publish("screen-" + index + "-setup", null, this); 
        };

    // Go To Screen
        imeiapp.utils.gotoScreen = function(index, duration){

            // Deactivate Current Screen
                imeiapp.utils.deactivateActiveScreen();

            // Set Step
                imeiapp.stats.step = index;

            // Activate New Screen
                imeiapp.utils.activateScreen( imeiapp.stats.step );
        };

            imeiapp.utils.gotoNextScreen = function(){

                imeiapp.utils.gotoScreen( imeiapp.stats.step + 1 );
            }; 

            imeiapp.utils.gotoPreviousScreen = function(){

                imeiapp.utils.gotoScreen( imeiapp.stats.step - 1 );
            };

    // Update sections that display the Invoice Number 
        imeiapp.utils.updateInvoiceNumberReferences = function(){

            for (var i = imeiapp.DOM.invoiceNumberSlots.length - 1; i >= 0; i--) {
                imeiapp.DOM.invoiceNumberSlots[i].innerHTML = "#" + imeiapp.DOM.invoice.value; 
            }
        };

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

                    if (newimei === oldimei || newimei === null){ noChangeAnnouncement(); }

                    else if (newimei === "") { confirmDeleteRequest(); }

                    else { replaceIMEI(); }

                    imeiapp.pubsub.publish("imei-tally-updated", null, this );
                } 
        };

    // Force Screens to Full Window Height
        imeiapp.utils.setScreensHeight = function(){

            for (var i = imeiapp.DOM.screens.length - 1; i >= 0; i--) {

                if (i < imeiapp.stats.step) { break; }
                
                imeiapp.DOM.screens[i].style.height = window.innerHeight + "px"; 
            }

            imeiapp.pubsub.publish('screensResized', null, 'screenResizer');
        };

    // Activate IMEI Links on Review Stage
        imeiapp.utils.activateIMEIsForReview = function(){

            var IMEIsForReview = imeiapp.DOM.IMEIsForReview;

            for (var i = IMEIsForReview.length - 1; i >= 0; i--) {
                
                IMEIsForReview[i].addEventListener("click", function(){

                    var index = i;

                    return function(){
                        imeiapp.utils.reviewIMEI(index);
                    }                   
                }());
            }
        };

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
          }
        }());

    // Scroll to Active Screen
        imeiapp.animate.scrollToActiveScreen = function(duration){

            imeiapp.animate.scrollTo( imeiapp.DOM.screens[imeiapp.stats.step].offsetTop, duration );
        };

// # PUBSUB
    
    // Publish

        // Activate Restart Buttons
            for (var i = imeiapp.DOM.cancelRegistration.length - 1; i >= 0; i--) {
                
                imeiapp.DOM.cancelRegistration[i].addEventListener("click", function(){

                    imeiapp.pubsub.publish("cancel-registration", null, this);
                });
             }
                
        // Detect Window Resize
            imeiapp.utils.onResize(function(){

                imeiapp.pubsub.publish('windowResized', null, this);
            });

    // Subscribe

        // Update IMEI Tally Slots
            imeiapp.pubsub.subscribe(

                'imei-tally-updated',
                'tally-slots-updater',              
                function(){

                    var tallySlots = imeiapp.DOM.imeiTallySlots;
                    var tally = imeiapp.currentInvoice.imeis.length;

                    for (var i = tallySlots.length - 1; i >= 0; i--) {
                        tallySlots[i].innerHTML = tally;
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

        // Update Invoice Number Slots 
            imeiapp.pubsub.subscribe(

                'invoice-number-updated',
                'step-3-imei-list',             
                imeiapp.utils.updateInvoiceNumberReferences,
                null
            );

        // Restart -> Cancel Registration
            imeiapp.pubsub.subscribe(

                'cancel-registration', 
                'restartBtn',
                function(){

                    // Clear Input Fields
                        imeiapp.DOM.invoice.value = null;
                        imeiapp.DOM.IMEI.value = null;

                    // Reset Stored Data
                        imeiapp.currentInvoice.invoice = "";
                        imeiapp.currentInvoice.imeis = [];
                        imeiapp.pubsub.publish("imei-tally-updated", null, this );

                    imeiapp.utils.gotoScreen(0);
                },
                null
            );

        // Force Return to IMEI Collection Screen if none is stored
            imeiapp.pubsub.subscribe(

                'imei-tally-updated', 
                'gatekeeper',
                function(){

                    // required vars
                        var imeiScreenIndex = 1;

                    // filter
                        if ( imeiapp.stats.step <= imeiScreenIndex ){ return; }

                    // check if any imeis are saved
                        if( imeiapp.currentInvoice.imeis.length < 1 ){

                            alert("No IMEIs are currently attached. \n\nAdd at least 1 to Proceed");                            
                            imeiapp.utils.gotoScreen(imeiScreenIndex);
                        }
                },
                null
            );

        // Set Height on Window Resize
            imeiapp.pubsub.subscribe(
                'windowResized', 
                'windowSizeWatchdog',
                imeiapp.utils.setScreensHeight,
                null
            );

        // Scroll on Resize
            imeiapp.pubsub.subscribe(
                'screensResized', 
                'autoScroller',
                function(){

                    imeiapp.animate.scrollToActiveScreen(150);
                },
                null
            );

        // Scroll to Active Screen when Setup is Complete
            imeiapp.pubsub.subscribe(
                'screen-setup-complete', 
                'autoScroller',
                function(){

                    imeiapp.animate.scrollToActiveScreen();                    
                    imeiapp.pubsub.publish("scrolled-to-active-screen", null, "autoScroller");
                },
                null
            );

        // Log Result of Server-Sent Transaction Acknowledgement
            imeiapp.pubsub.subscribe(

                "server-acknowledged-transaction",
                "console.log",
                function(metadata){

                    var server_id = metadata.notificationParams.server_transaction_id;
                    var client_id = metadata.notificationParams.client_transaction_id;

                    if (server_id === client_id){

                        console.log("server received transaction " + server_id );

                    }

                    else { 

                        console.log("something went wrong: client and server id don't match");
                        console.log(metadata.notificationParams);
                    }
                },
                null
            );

        // screen-0-setup
            imeiapp.pubsub.subscribe(

                "screen-0-setup",
                "handyman",
                function(){

                    // req vars
                    var _app = imeiapp,
                        
                        _pubsub = _app.pubsub,
                        _publish = _pubsub.publish,
                        _subscribe = _pubsub.subscribe,
                        _unsubscribe = _pubsub.unsubscribe,

                        index = 0,

                        startRegistration = function(){

                            imeiapp.utils.gotoNextScreen();
                        },

                        mapEnterBtnToNextStep = function(event){

                            if(event.keyCode === 13){

                                imeiapp.DOM.startRegistration.click();
                            }
                        },

                        screenSetup = function(){

                            // activate start registration button
                                imeiapp.DOM.startRegistration.addEventListener("click", startRegistration);

                            // set enter to progress screen
                                window.addEventListener("keydown", mapEnterBtnToNextStep);

                            // ready visuals
                                imeiapp.ui.activateScreen( index );

                            // screen setup complete
                                _publish("screen-setup-complete", null, "screen-" + index + "-setup");
                        },

                        screenTeardown = function(){

                            // deactivate Start Registration Btn
                                imeiapp.DOM.startRegistration.removeEventListener("click", startRegistration);

                            // unmap progress screen
                                window.removeEventListener("keydown", mapEnterBtnToNextStep);

                            // disable visuals                          
                                imeiapp.ui.deactivateScreen( index );
                        };

                    // do setup
                        screenSetup();

                    // listen for teardown
                        _subscribe(

                            "screen-teardown",
                            "screen-0-setup",
                            function(){

                                // do teardown
                                    screenTeardown();

                                // unsubscribe from tear-down list
                                    _unsubscribe("screen-teardown", "screen-0-setup");
                            },
                            null
                        );
                },
                null
            );

        // screen-1-setup
            imeiapp.pubsub.subscribe(

                "screen-1-setup",
                "handyman",
                function(){

                    // req vars
                    var _app = imeiapp,
                        
                        _DOM = _app.DOM,
                        _utils = _app.utils,
                        _pubsub = _app.pubsub,

                        _addClass = _utils.addClass,
                        _removeClass = _utils.removeClass,

                        _publish = _pubsub.publish,
                        _subscribe = _pubsub.subscribe,
                        _unsubscribe = _pubsub.unsubscribe,

                        index = 1,
                        nextBtn = _DOM.screens[ imeiapp.stats.step ].getElementsByClassName("nextStep")[0],

                        saveIMEI = function(){                            

                            // Don't Save Empty Entries
                                if ( !_DOM.IMEI.value ){

                                    alert("No IMEI Number to Store");
                                    
                                    inputFieldAttentionGetter( _DOM.IMEI );

                                    return;
                                }

                            // Create IMEI Container for Invoice if it doesn't exist
                                if (!_app.currentInvoice.imeis){ _app.currentInvoice.imeis = []; }

                            // Save to JSON Object
                                _app.currentInvoice.imeis.push( _DOM.IMEI.value );

                            // Update User
                                alert("'" + _DOM.IMEI.value + "' has been stored" );

                            // Broadcast New Tally
                                _publish("imei-tally-updated", null, this );

                            // Cleanup & Fix Focus
                                _DOM.IMEI.value = null;
                                _DOM.IMEI.focus();
                        },

                        editIMEI = function(){                            
                                    
                            // keep track of original total
                                var totalOldIMEIs = _app.currentInvoice.imeis.length;

                            // iterate over all attached invoices and review them
                                for (var i = 0; i < _app.currentInvoice.imeis.length; i++) {

                                    // keep track of pre-review imei total
                                        var beforeReviewTally = _app.currentInvoice.imeis.length;

                                    // process this IMEI
                                        _utils.reviewIMEI(i);

                                    // if a delete occured, fix index
                                        if (beforeReviewTally > _app.currentInvoice.imeis.length){ i = i - (beforeReviewTally - _app.currentInvoice.imeis.length); }
                                }

                            // Check if any IMEIs are attached 
                                if (_app.currentInvoice.imeis.length === 0){

                                    alert("There are no IMEIs attached to this Invoice");
                                }

                            // Announce Tally Total Change if the numbers dont add up
                                if (totalOldIMEIs !== _app.currentInvoice.imeis.length){                                

                                    _publish("imei-tally-updated", null, this );
                                }
                        },

                        inputFieldAttentionGetter = function(input){

                            _addClass( input, "attention" );
                            input.addEventListener('input', inputFieldAttentionRemover);
                        },

                        inputFieldAttentionRemover = function(){

                            _removeClass( this, "attention" );
                            this.removeEventListener('input', inputFieldAttentionRemover);
                        },

                        inputFieldEnterBtnLogic = function(e){

                            // filter out non-enter btn presses
                                if (e.keyCode !== 13){ return; }

                            // special condition: empty field and at least 1 imei has already been stored
                                if (this.value === "" && _app.currentInvoice.imeis.length > 0){
                                    
                                    nextBtn.click();
                                }
                            
                            // do default
                                else{ _DOM.saveIMEI.click(); }
                        },

                        setNextBtnVisibility = function(){

                            if( _app.currentInvoice.imeis.length > 0 ){ _removeClass( nextBtn, "invisible"); }
                            
                            else { _addClass( nextBtn, "invisible"); }
                        },

                        screenSetup = function(){

                            // activate save imei button
                                _DOM.saveIMEI.addEventListener("click", saveIMEI);

                            // activate edit imei button
                                _DOM.editSavedIMEIs.addEventListener("click", editIMEI);

                            // enter button behavior for input field
                                _DOM.IMEI.addEventListener('keydown', inputFieldEnterBtnLogic);

                            // determine if next button is shown or hidden
                                setNextBtnVisibility();

                            // set next button to recalculate visibility on tally change
                                _subscribe("imei-tally-updated", "screen-" + index + "-next-btn", setNextBtnVisibility, null );

                            // set focus on input field after page has scrolled to                                
                                _subscribe(
                                    "scrolled-to-active-screen", 
                                    "focus-setter", 
                                    function(){

                                        // set focus on input field
                                            _DOM.IMEI.focus();

                                        // unsubscribe (one time event)
                                            _unsubscribe("scrolled-to-active-screen", "focus-setter");
                                    }, 
                                    null 
                                );

                            // ready visuals
                                _app.ui.activateScreen( index );

                            // screen setup complete
                                _publish("screen-setup-complete", null, "screen-" + index + "-setup");
                        },

                        screenTeardown = function(){

                            // deactivate save imei button
                                _DOM.saveIMEI.removeEventListener("click", saveIMEI);

                            // deactivate edit imei button
                                _DOM.editSavedIMEIs.removeEventListener("click", editIMEI);

                            // remove enter button behavior for input field
                                _DOM.IMEI.removeEventListener('keydown', inputFieldEnterBtnLogic);
                            
                            // remove next button visibility updater
                                _unsubscribe("imei-tally-updated", "screen-" + index + "-next-btn");

                            // disable visuals                          
                                _app.ui.deactivateScreen( index );
                        };

                    // do setup
                        screenSetup();

                    // listen for teardown
                        _subscribe(

                            "screen-teardown",
                            "screen-" + index + "-setup",
                            function(){

                                // do teardown
                                    screenTeardown();

                                // unsubscribe from tear-down list
                                    _unsubscribe("screen-teardown", "screen-" + index + "-setup");
                            },
                            null
                        );
                },
                null
            );

        // screen-2-setup
            imeiapp.pubsub.subscribe(

                "screen-2-setup",
                "handyman",
                function(){

                    // req vars
                    var _app = imeiapp,
                        
                        _DOM = _app.DOM,
                        _utils = _app.utils,
                        _pubsub = _app.pubsub,

                        _addClass = _utils.addClass,
                        _removeClass = _utils.removeClass,

                        _publish = _pubsub.publish,
                        _subscribe = _pubsub.subscribe,
                        _unsubscribe = _pubsub.unsubscribe,

                        index = 2,
                        nextBtn = _DOM.screens[ imeiapp.stats.step ].getElementsByClassName("nextStep")[0],

                        inputFieldAttentionGetter = function( input ){

                            _addClass( input, "attention" );
                            input.addEventListener('input', inputFieldAttentionRemover);
                        }

                        inputFieldAttentionRemover = function(){

                            _removeClass( this, "attention" );
                            this.removeEventListener('input', inputFieldAttentionRemover);
                        },

                        saveInvoiceNumber = function(){                            

                            // Don't Save Empty Entries
                                if ( !_DOM.invoice.value ){

                                    alert("An Invoice Number is Needed to Continue");
                                    
                                    inputFieldAttentionGetter( _DOM.invoice );

                                    return;
                                }                            

                            // Update Invoice Object
                                imeiapp.currentInvoice.invoice = imeiapp.DOM.invoice.value;

                                _publish("invoice-number-updated", null, this);

                                alert("The Invoice Number is now '" + imeiapp.DOM.invoice.value + "'");
                        },

                        inputFieldEnterBtnLogic = function(e){

                            // filter out non-enter btn presses
                                if (e.keyCode !== 13){ return; }

                            // special condition: empty field and at least 1 imei has already been stored
                                if (this.value !== "" && _app.currentInvoice.invoice === this.value){
                                    
                                    nextBtn.click();
                                }
                            
                            // do default
                                else{ saveInvoiceNumber(); }
                        },

                        setNextBtnVisibility = function(){

                            if( _app.currentInvoice.invoice && _app.currentInvoice.invoice !== "" ){ _removeClass( nextBtn, "invisible"); }
                            
                            else { _addClass( nextBtn, "invisible"); }
                        },

                        screenSetup = function(){

                            // enter button behavior for input field
                                _DOM.invoice.addEventListener('keydown', inputFieldEnterBtnLogic);

                            // determine if next button is shown or hidden
                                setNextBtnVisibility();

                            // set next button to recalculate visibility on tally change
                                _subscribe("invoice-number-updated", "screen-" + index + "-next-btn", setNextBtnVisibility, null );

                            // ready visuals
                                _app.ui.activateScreen( index );

                            // set focus on input field after page has scrolled to                                
                                _subscribe(
                                    "scrolled-to-active-screen", 
                                    "focus-setter", 
                                    function(){

                                        // set focus on input field
                                            _DOM.invoice.focus();

                                        // unsubscribe (one time event)
                                            _unsubscribe("scrolled-to-active-screen", "focus-setter");
                                    }, 
                                    null 
                                );

                            // screen setup complete
                                _publish("screen-setup-complete", null, "screen-" + index + "-setup");
                        },

                        screenTeardown = function(){

                            // remove enter button behavior for input field
                                _DOM.invoice.removeEventListener('keydown', inputFieldEnterBtnLogic);
                            
                            // remove next button visibility updater
                                _unsubscribe("invoice-number-updated", "screen-" + index + "-next-btn");

                            // disable visuals                          
                                _app.ui.deactivateScreen( index );
                        };

                    // do setup
                        screenSetup();

                    // listen for teardown
                        _subscribe(

                            "screen-teardown",
                            "screen-" + index + "-setup",
                            function(){

                                // do teardown
                                    screenTeardown();

                                // unsubscribe from tear-down list
                                    _unsubscribe("screen-teardown", "screen-" + index + "-setup");
                            },
                            null
                        );
                },
                null
            );

        // screen-3-setup
            imeiapp.pubsub.subscribe(

                "screen-3-setup",
                "handyman",
                function(){

                    // req vars
                    var _app = imeiapp,
                        
                        _DOM = _app.DOM,
                        _utils = _app.utils,
                        _pubsub = _app.pubsub,

                        _addClass = _utils.addClass,
                        _removeClass = _utils.removeClass,

                        _publish = _pubsub.publish,
                        _subscribe = _pubsub.subscribe,
                        _unsubscribe = _pubsub.unsubscribe,

                        index = 3,
                        completeBtn = _DOM.completeRegistration,

                        saveRegistration = function(){

                            // store the registration
                                _utils.storeRegistration( _app.currentInvoice );
                            
                            // job done! tell the world!!!
                                _publish("registration-completed", null, this);
                        },

                        updateListOfIMEIs = function(){

                            // required vars
                            var imeiList = _DOM.imeiReviewList,
                                entries = "";

                            // create dom string for each imei
                                for (var i = 0; i < imeiapp.currentInvoice.imeis.length; i++) {
                                    entries = entries + "<span class='imeiForReview'>" + imeiapp.currentInvoice.imeis[i] + "</span>" + (i < imeiapp.currentInvoice.imeis.length - 1 ? " | " : "");
                                }

                            // render it
                                imeiList.innerHTML = entries;

                            // activate the links
                                imeiapp.utils.activateIMEIsForReview();
                        },

                        enterBtnLogic = function(e){

                            // filter out non-enter btn presses
                                if (e.keyCode !== 13){ return; }

                            saveRegistration();
                        },

                        screenSetup = function(){

                            // enable complete registration button
                                completeBtn.addEventListener("click", saveRegistration);
                            
                            // ready global enter trapper
                                window.addEventListener('keydown', enterBtnLogic);

                            // Update List of IMEIs if Tally Changes
                                _subscribe( 'imei-tally-updated', 'imei-list-updater', updateListOfIMEIs, null );


                            // ready visuals
                                updateListOfIMEIs();
                                _app.ui.activateScreen( index );

                            // screen setup complete
                                _publish("screen-setup-complete", null, "screen-" + index + "-setup");
                        },

                        screenTeardown = function(){

                            // disable complete registration button
                                completeBtn.removeEventListener("click", saveRegistration);

                            // remove global enter trapper
                                window.removeEventListener('keydown', enterBtnLogic);

                            // Stop IMEI List Updater
                                _unsubscribe( 'imei-tally-updated', 'imei-list-updater' );

                            // disable visuals                          
                                _app.ui.deactivateScreen( index );
                        };

                    // do setup
                        screenSetup();

                    // listen for teardown
                        _subscribe(

                            "screen-teardown",
                            "screen-" + index + "-setup",
                            function(){

                                // do teardown
                                    screenTeardown();

                                // unsubscribe from tear-down list
                                    _unsubscribe("screen-teardown", "screen-" + index + "-setup");
                            },
                            null
                        );
                },
                null
            );

    // # GENERAL

        // Disable Touch Scrolling
            document.addEventListener('touchmove', function(e){

                e.preventDefault();
            });

        // Activate Back Buttons
            for (var i = imeiapp.DOM.backBtn.length - 1; i >= 0; i--) {
                
                imeiapp.DOM.backBtn[i].addEventListener("click", function(){

                    imeiapp.utils.gotoScreen(imeiapp.stats.step - 1);
                });
            }

        // Activate Next Buttons
            for (var i = imeiapp.DOM.nextBtn.length - 1; i >= 0; i--) {
                
                imeiapp.DOM.nextBtn[i].addEventListener("click", function(){

                    imeiapp.utils.gotoScreen(imeiapp.stats.step + 1);
                });
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
            }

        // get network state
            imeiapp.network.networkState = function(){

                return Offline.state;
            }

        // force network state check
            imeiapp.network.checkNetworkState = function(){

                Offline.check();
            }

        // set network online class
            imeiapp.network.setOnlineState = function(){
                
                var _utils = imeiapp.utils;
                var body = document.body;

                _utils.removeClass(body, "connection-offline");
                _utils.addClass(body, "connection-online");
            }

        // set network offline class
            imeiapp.network.setOfflineState = function(){
                
                var _utils = imeiapp.utils;
                var body = document.body;

                _utils.removeClass(body, "connection-online");
                _utils.addClass(body, "connection-offline");
            }

    // # NETWORK ACTIVITY

        // send registrations to server
            imeiapp.network.pushRegistrations = function(){

                // required variables & shorthand
                    var _i = imeiapp;

                    var _u = _i.utils,
                        _n = _i.network;

                // turn registrations into a transaction and get the transaction id
                    var transaction_id = _u.storeTransaction();

                // send transaction to server               
                    _n.sendTransaction( transaction_id );

                return true;            
            }

        // send transaction to server
            imeiapp.network.sendTransaction = function(transaction_id){

                // filter out improper input
                    if( !transaction_id ) { return false; }

                // required variables
                    var _publish = imeiapp.pubsub.publish,          
                        _POST = imeiapp.network.POST,
                        _u = imeiapp.utils,
                        utf8 = _u.utf8,

                        transaction = _u.getTransaction(transaction_id),
                        transaction_string = JSON.stringify(transaction),
                        clean_transaction_string = utf8(transaction_string),
                        
                        POST_success = function(response){

                            var publish_params = {};
                                
                                publish_params.server_transaction_id = response,
                                publish_params.client_transaction_id = transaction_id;

                            _publish(

                                "server-acknowledged-transaction",
                                publish_params,
                                "sendTransaction"
                            );
                        };

                // send transaction
                    var sendTransactionSuccess = _POST(

                        location.href + 'process-transaction.php',
                        't=' + clean_transaction_string,
                        POST_success                    
                    );

                return sendTransactionSuccess;
            };

        // check status of pending transactions
            imeiapp.network.checkTransactionStatus = function(){

                // required vars
                var _publish = imeiapp.pubsub.publish,          
                    _POST = imeiapp.network.POST,
                    _u = imeiapp.utils,
                    
                    keys_to_check = [],
                    transactions_db = _u.getTransactionStorage(),
                    
                    POST_success = function(response){

                        var status_updates = JSON.parse(response);

                            _publish(

                                "transaction-status-received",
                                status_updates,
                                "checkTransactionStatus"
                            );
                    }

                // get transaction ids
                    for (var transaction_id in transactions_db) {
                        
                        if (!transactions_db.hasOwnProperty(transaction_id)) { continue; }
                        
                        keys_to_check.push( transaction_id );               
                    }

                    keys_to_check = JSON.stringify( keys_to_check );

                // POST             
                    _POST(

                        location.href + 'transaction-status-check.php',
                        't=' + keys_to_check,
                        POST_success
                    );
            };

        // check status of pending transactions
            imeiapp.network.confirmArchivedTransactions = function(){

                // required variables
                var _app = imeiapp,
                    _u = _app.utils,
                    _POST = _app.network.POST,
                    _publish = _app.pubsub.publish,         

                    keys_to_confirm = [],
                    archives_db = _u.getArchiveStorage(),

                    post_success = function(response){

                        var status_updates = JSON.parse(response);

                        _publish(

                            "transactions-confirmed",
                            status_updates,
                            "confirmArchivedTransactions"
                        );
                    }

                // get keys to confirm
                    for (var transaction_id in archives_db) {
                        
                        if (!archives_db.hasOwnProperty(transaction_id)) { continue; }
                        
                        keys_to_confirm.push( transaction_id );             
                    }

                    keys_to_confirm = JSON.stringify( keys_to_confirm );

                // send to server
                    imeiapp.network.POST(

                        location.href + 'confirm-transaction.php',
                        't=' + keys_to_confirm,
                        post_success
                    );
            };

        // create POST request
            imeiapp.network.POST = function(url, msg, success, fail){

                // filter
                    if (!url){ return false; }

                // reqs
                var server_trip = new XMLHttpRequest();
                    
                    msg = msg || "",
                    success = success || function(response){ console.log("POST TO " + url + " SUCCESSFUL! \nRESPONSE: " + response ); },
                    fail = fail || function(response){ console.log("POST TO " + url + " UNSUCCESSFUL. \nXMLHTTP OBJECT:"); console.log(response); };

                // prep POST
                    server_trip.open('POST', url, true);
                    server_trip.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    server_trip.onreadystatechange = function(){

                        // filter uncompleted responses
                            if (server_trip.readyState !=4){ return; }

                        // success
                            if ( server_trip.status > 199 && server_trip.status < 400 ){ success(server_trip.responseText); }

                        // fail
                            else{ fail(server_trip); }                      
                    }

                // POST
                    server_trip.send(msg);

                return true;    
            };

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
                        if ( status[transaction_key] === "false" ){

                            imeiapp.network.sendTransaction(transaction_key);
                            continue;
                        }
                    // transaction processed
                        if ( status[transaction_key] === "processed" ){

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
                    }

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

    // confirm network transactions
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

    // Network Status Reconnecting -> Indicator Light Flicker 
        imeiapp.pubsub.subscribe(

            'network-reconnecting', 
            'light-flicker',
            function(){

                var _utils = imeiapp.utils,
                    indicators = imeiapp.DOM.connectionIndicator;
                
                // Flicker Lights while Reconnecting  
                    imeiapp.network.checkingLightFlickerInterval = setInterval( function(){             

                        for (var i = indicators.length - 1; i >= 0; i--) {
                            
                            // Orange On
                                _utils.addClass(indicators[i], "connection-checking");

                            // Orange Off
                                setTimeout( function(){

                                    var count = i;

                                    return function(){ _utils.removeClass(indicators[count], "connection-checking"); };
                                }(), 350);
                        }
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
            imeiapp.network.setOnlineState,
            null
        );

    // Network Online -> Network Offline
        imeiapp.pubsub.subscribe(

            'network-down', 
            'online-indicator',
            imeiapp.network.setOfflineState,
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

    // Confirm Transaction was Received by Server
        imeiapp.pubsub.subscribe(

            'network-up', 
            'confirm-transactions',
            function(){

                // reqs
                var _app = imeiapp,
                    _n = _app.network,
                    _s = window.localStorage,
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
                    _s = window.localStorage,

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
                    _s = window.localStorage,

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