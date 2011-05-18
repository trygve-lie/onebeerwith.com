(function() {

    "use strict";

    var html5ForIE = function(elements) {
        var i = elements.length;
        while (i--) {
            document.createElement(elements[i]);
        }
    }(['header','section','article','nav','time','footer']);



    var sortObjectsByAttribute = function (name) {
        return function(obj1,obj2){
            var n1;
            var n2;
            if(typeof obj1 === 'object' && typeof obj2 === 'object' && obj1 && obj2){
                n1 = obj1[name];
                n2 = obj2[name];
                if(n1 === n2){
                    return obj1;
                }
                if(typeof n1 === typeof n2){
                    return n1 < n2 ? -1 : 1;
                }
            }else{
                throw{
                    name: 'Error',
                    message: 'Expected object when sorting by ' + name
                };
            }
        };
    };



    var getDataAttributes = function (element) {

        var dataObjects = [];

        var i = element.attributes.length;

        while (i--) {
            var attributeName = element.attributes[i].name;
            var prefix = attributeName.substring(0,8);

            if (prefix === 'data-img') {
                dataObjects.push({key : attributeName.substring(8), value : element.attributes[i].value});
            }
        }

        return dataObjects;
    };



    var findImage = function (imagesObj, currentWidth) {

        if ( currentWidth < imagesObj[0].key ) {
            return imagesObj[0].value;

        } else if ( currentWidth > imagesObj[(imagesObj.length - 1)].key ) {
            return imagesObj[(imagesObj.length - 1)].value;

        } else {
            for( var i = 1; i < imagesObj.length; i++ ) {
                if ( currentWidth >= imagesObj[(i-1)].key && currentWidth <= imagesObj[(i)].key ) {
                    return imagesObj[i].value;
                }
            }
        }

    };



    var setImage = function (element, images, currentImageUrl) {
        // var imageUrl = findImage(images, document.documentElement.clientWidth);
        var imageUrl = findImage(images, document.defaultView.getComputedStyle(element, null).getPropertyValue('width'));

        // Update DOM only when new image needs to be set.
        if( currentImageUrl !== imageUrl) {
            element.style.backgroundImage = "url(" + imageUrl + ")";
        }

        return imageUrl;
    };



    var load = function() {
        var e = document.getElementById('i');
        var images = getDataAttributes(e);

        // Sort the images so all browsers have the same order.
        images.sort(sortObjectsByAttribute('key'));

        var currentImage = setImage(e, images, undefined);

        window.onresize = function(event) {
            // console.log(document.defaultView.getComputedStyle(e, null).getPropertyValue('width'));
            console.log(screen.width);
            currentImage = setImage(e, images, currentImage);
        }

    };



    document.addEventListener('DOMContentLoaded', load, false);

}());