

/* ======= Model ======= */

var model = {
    currentCat: null,
    cats: [
        {
            clickCount : 0,
            name : 'Sweetie1',
            imgSrc : 'img/434164568_fea0ad4013_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/bigtallguy/434164568'
        },
        {
            clickCount : 0,
            name : 'Tiger',
            imgSrc : 'img/4154543904_6e2428c421_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/xshamx/4154543904'
        },
        {
            clickCount : 0,
            name : 'Scaredy',
            imgSrc : 'img/22252709_010df3379e_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/kpjas/22252709'
        },
        {
            clickCount : 0,
            name : 'Shadow',
            imgSrc : 'img/1413379559_412a540d29_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/malfet/1413379559'
        },
        {
            clickCount : 0,
            name : 'Sleepy',
            imgSrc : 'img/9648464288_2516b35537_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/onesharp/9648464288'
        },
        {
            clickCount: 0,
            name : 'Tora',
            imgSrc : 'img/J Tora.jpg',
            imgAttribution : 'null'
        }
    ]
};


/* ======= Octopus ======= */

var controller = {

    init: function() {
        // set our current cat to the first one in the list
        model.currentCat = model.cats[0];

        // tell our views to initialize
        catListView.init();
        catView.init();
    },

    getCurrentCat: function() {
        return model.currentCat;
    },

    getCats: function() {
        return model.cats;
    },

    // set the currently-selected cat to the object passed in
    setCurrentCat: function(cat) {
        model.currentCat = cat;
    },

    // increments the counter for the currently-selected cat
    incrementCounter: function() {
        model.currentCat.clickCount++;
        catView.render();
    }
};


/* ======= View ======= */

var catView = {

    init: function() {
        // store pointers to our DOM elements for easy access later
        this.catElem = document.getElementById('cat');
        this.catNameElem = document.getElementById('cat-name');
        this.catImageElem = document.getElementById('cat-img');
        this.countElem = document.getElementById('cat-count');

        // on click, increment the current cat's counter
        this.catImageElem.addEventListener('click', function(){
            controller.incrementCounter();
        });

        // render this view (update the DOM elements with the right values)
        this.render();
    },

    render: function() {
        // update the DOM elements with values from the current cat
        var currentCat = controller.getCurrentCat();
        this.countElem.textContent = currentCat.clickCount;
        this.catNameElem.textContent = currentCat.name;
        this.catNameElem.style.color = "blue"; //So that we can highlight it.
        this.catImageElem.src = currentCat.imgSrc;
    }
};

var catListView = {

    init: function() {
        // store the DOM element for easy access later
        this.catListElem = document.getElementById('cat-list');

        // render this view (update the DOM elements with the right values)
        this.render();
    },

    render: function() {
        var cat, elem, i;
        // get the cats we'll be rendering from the controller
        var cats = controller.getCats();

        // empty the cat list
        this.catListElem.innerHTML = '';

        var handler = function() {
            var element = this; // will reference caller, can be any of the elems created in below loop
            // get element id to determine which index of the cat Object in the cats Array we need
            var cat = cats[ parseFloat( element.getAttribute("id"))];
            controller.setCurrentCat(cat);
            catView.render();
        };

        // loop over the cats
        for (i = 0; i < cats.length; i++) {
            // this is the cat we're currently looping over
            cat = cats[i];

            // make a new cat list item and set its text
            elem = document.createElement('li');
            elem.textContent = cat.name;

            // on click, setCurrentCat and render the catView
            // (this uses our closure-in-a-loop trick to connect the value
            //  of the cat variable to the click event function)
            elem.addEventListener('click', (function(catCopy) {
                return function() {
                    controller.setCurrentCat(catCopy);
                    catView.render();
                };
            })(cat));

            // assign attribute id, it will reference the index of the cat in the Array (is current iterator)
            elem.setAttribute("id", i.toString());
            elem.addEventListener('click',handler);

            // abstraction example of event dispatch system (e.g. internal "ublish-subscribe"
            // var obj = {
            //     addEventListener: function(type, fn) {
            //         // register key "type"in "hashmap", assign fn as its value
            //         this.handlers[type] = fn;
            //     },
            //     dispatchEvent: function(type) {
            //         // retrieve registered function registered for given type
            //         var fn = this.handlers[type];
            //         fn.apply(this); // execute function IN THE SCOPE OF THIS OBJECT (calldr)
            //     },
            //     handlers: {} // poor mans hashmap
            // };
            // obj.addEventListener("foo", function() { console.warn("hello."); }
            // obj.dispatchEvent( "foo"); // will log "hello

            // var Human = function(name) {
            //     var _name = name; // inner variable only accessible within this function
            //     this.getName = function() {
            //         console.warn(_name); // inner variable accessible as this function is within scope of higher order function
            //     };
            //     this.setName = function(name) {
            //         _name = name; // inner variable accessible as this function is within scope of higher order function
            //     }
            // };
            // var Laxmi = new Human("Laxmikant Somni");
            // Laxmi._name; // undefined, scope variable _name not accessible outside of Human function context
            // Laxmi.getName(); // "Laxmikant Somni", exposed function getName is defined within scope of Human function, can access _name



            // alternative: use bind() keyword to bind function callback
            // to a specific scope: in this loop each elem. that fires "click"
            // will execute the callback function in the scope of whatever
            // the value of cat was in this loops iteration
            //
            // elem.addEventListener('click', function(e) {
            //     var catCopy = this;
            //     controller.setCurrentCat(catCopy);
            //     catView.render();
            // }.bind(cat));

            // finally, add the element to the list
            this.catListElem.appendChild(elem);
        }
    }
};

// make it go!
controller.init();

// // ES2017 inline goodness
//
// async function foo() {
//     await fetchFromBackend();
// }

// old style

var successCallback = function ()  {
    console.log('done');
    fetchFromBackend.removeEventListener("complete", successCallback);
};

function foo() {
    fetchFromBackend.addEventListener("complete", successCallback );
    console.log("foo executed");

}

function fetchFromBackend() {
    // theoretical rest call
    // which dispatches "complete" event on success
}

foo();




