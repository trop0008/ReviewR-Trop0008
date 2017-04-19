/*****************************************************************
File: index.js
Author: Marjan Tropper
Description:

ReviewR Assignment - iOS Cordova App
- All the data needs to be saved in localStorage. Using the key "reviewr-trop0008"

Version: 0.1.1
Updated: Mar 31, 2017


   
*****************************************************************/
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
"use strict";
var app = {
    savedListReviews: {
        reviews: []
    }
    , currentReview: null
    , initialize: function () {
        try {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        }
        catch (e) {
            document.addEventListener('DOMContentLoaded', this.onDeviceReady.bind(this), false);
        }
    }
    , onDeviceReady: function () {
        //set up event listeners and default variable values
        window.addEventListener('push', app.pageChanged);
        //triger the page change function to load the content
        app.pageChanged();
    }
    , pageChanged: function () {
        let EditFlag = false;
        let currentIdeas = null;
        let rating = 3;
        let stars = null;
        let deleteIndex;
        stars = document.querySelectorAll('.star');
        addListeners();
        setRating();

        function setRating() {
            [].forEach.call(stars, function (star, index) {
                if (rating > index) {
                    star.classList.add('rated');
                    console.log('added rated on', index);
                }
                else {
                    star.classList.remove('rated');
                    console.log('removed rated on', index);
                }
            });
        }

        function addListeners() {
            [].forEach.call(stars, function (star, index) {
                star.addEventListener('click', (function (idx) {
                    console.log('adding listener', index);
                    return function () {
                        rating = idx + 1;
                        console.log('Rating is now', rating)
                        setRating();
                    }
                })(index));
            });
        }
        let contentDiv = document.querySelector(".content");
        let pageId = contentDiv.id;
        document.getElementById("TakePicReview").addEventListener("click", takePicFunc);
        document.getElementById("cancelAddReview").addEventListener("click", cancelModal);
        document.getElementById("saveAddReview").addEventListener("click", saveModal);
        document.getElementById("closeAddReview").addEventListener("touchstart", closeModal);
        document.getElementById("saveAddReview").style.display="none";
        document.getElementById("saveDeleteReview").addEventListener("click", deleteReview);
        document.getElementById("cancelDeleteReview").addEventListener("click", cancelModal);
        document.getElementById("closeRemoveReview").addEventListener("touchstart", closeModal);
        getLocalStorage();
        listReviews();
        
        function closeModal(ev) {
           
            
            document.getElementById("itemName").value = "";
            rating=3;
            
            document.getElementById("TakePicReview").style.display="block";
            document.getElementById("saveAddReview").style.display="none";
            
            document.getElementById("personError").innerHTML="";
            document.getElementById('cameraimage').innerHTML="";
            app.currentReview = null;
            
            
           
           
            document.getElementById('itemImg').innerHTML="";
            document.getElementById("saveAddReview").style.display="none";
            document.getElementById("personError").innerHTML="";
            setRating();
        }

        function cancelModal(ev) {
            ev.preventDefault;
            let clickedLink = ev.target.id;
            
            document.getElementById("itemName").value = "";
            rating=3;
            
            document.getElementById("TakePicReview").style.display="block";
            document.getElementById("saveAddReview").style.display="none";
            document.getElementById("reviewModal").classList.remove('active');
            document.getElementById("personError").innerHTML="";
            document.getElementById('cameraimage').innerHTML="";
            app.currentReview = null;
            
            
            document.getElementById("deleteModal").classList.remove('active');
           
            document.getElementById('itemImg').innerHTML="";
            document.getElementById("saveAddReview").style.display="none";
            document.getElementById("personError").innerHTML="";
            setRating();
            
        }
        

        function showModal() {
             document.getElementById("reviewModal").classList.add('active');
               
        }

        function takePicFunc(ev) {
            ev.preventDefault;
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50
                , destinationType: Camera.DestinationType.FILE_URI
            });

            function onSuccess(imageURI) {
                let div = document.getElementById('cameraimage');
                let image = document.createElement('img');
                image.src = imageURI;
                div.appendChild(image);
                let id = Date.now();
                app.currentReview = {
                            "id": id
                            , "name": document.getElementById("itemName").value
                            , "rating": rating
                            , "img": imageURI
                        };
                document.getElementById("TakePicReview").style.display="none";
                document.getElementById("saveAddReview").style.display="block";
                console.log(app.currentReview);
                
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
      
        }
        
        /********* Delete review *************/
        function deleteReview(ev) {
                            ev.preventDefault;
                            
                            app.savedListReviews.reviews.splice(deleteIndex, 1);
                            setLocalStorage();
                            listReviews(); 
                        
                    rating=3;
            
                    document.getElementById("TakePicReview").style.display="block";
                    document.getElementById("reviewModal").classList.remove('active');
            
                    document.getElementById("deleteModal").classList.remove('active');
                    document.getElementById('cameraimage').innerHTML="";
                    document.getElementById('itemImg').innerHTML="";
                    document.getElementById("saveAddReview").style.display="none";
                    document.getElementById("personError").innerHTML="";
                    app.currentReview = null;
                           
                            
                        
                        }
        /***************************/
        function saveModal(ev) {
           ev.preventDefault;
                let itemName = document.getElementById("itemName").value;
                
                if (itemName != "" ) {
                     app.currentReview.name= document.getElementById("itemName").value;
                     app.currentReview.rating= rating;       
                            
                        
                    
                        app.savedListReviews.reviews.push(app.currentReview);
                        
                    
                    setLocalStorage();
                    listReviews(); 
                    document.getElementById("itemName").value = "";
                    rating=3;
            
                    document.getElementById("TakePicReview").style.display="block";
                    document.getElementById("reviewModal").classList.remove('active');
            
                    document.getElementById('cameraimage').innerHTML="";
                    document.getElementById("saveAddReview").style.display="none";
                    document.getElementById("personError").innerHTML="";
                    app.currentReview = null;
                    setRating();
                }
                else {
                    document.getElementById("personError").innerHTML= "Please enter an item name.";
                }
                
            
        }
        /**************************** local storage functions ********************************/
        function setLocalStorage() {
            if (localStorage) {
                localStorage.setItem("reviewr-trop0008", JSON.stringify(app.savedListReviews));
                console.log("reading reviews from localstorage" +app.savedListReviews);
            }
        }

        function getLocalStorage() {
            if (!localStorage.getItem("reviewr-trop0008")) {
                let header = document.getElementById("pagehead");
                // nothing is registered so automatically open the add modal
                header.innerHTML = "You do not have any reviews. Please use the Add Review button on the top right corner to create a Review. "
            }
            else {
                app.savedListReviews = JSON.parse(localStorage.getItem('reviewr-trop0008'));
                console.log("setting reviews from localstorage" +app.savedListReviews);
            }
        }
        /********************* list profiles ********************/
        function listReviews() {
            let reviewList = document.getElementById('reviewList');
            reviewList.innerHTML = "";
            let header = document.createElement("h3");
            header.className = "pageheader";
            if (app.savedListReviews.reviews != null) {
                if (app.savedListReviews.reviews.length == 0) {
                    header.innerHTML = "You do not have any reviews. Please use the Add Review button on the top right corner to create a Review. ";
                }
                else {
                    header.innerHTML = "Reviews list:"
                    let ul = document.createElement("ul");
                    ul.className = "table-view";
                    app.savedListReviews.reviews.forEach(function (savedReview, index) {
                        // the saved list items are created here
                        
                        let li = document.createElement("li");
                        li.className = "table-view-cell ";
                        let span = document.createElement("span");
                        span.className = "media-object pull-right icon icon-right-nav midline";
                        let img = document.createElement("img");
                        img.className = "media-object  pull-left";
                        img.src = savedReview.img;
                        let div = document.createElement("div");
                        div.className = "media-body ";
                        
                        let h4 = document.createElement("h4");
                        h4.innerHTML = savedReview.name;
                        let p = document.createElement("p");
                        p.innerHTML = savedReview.rating + " Stars";
                        div.appendChild(h4);
                        div.appendChild(p);
                        li.appendChild(span);
                        li.appendChild(img);
                        li.appendChild(div);
                        ul.appendChild(li);
                        span.addEventListener("click", editReview);

                        function editReview(ev) {
                            ev.preventDefault;
                            EditFlag = true;
                            app.currentReview = savedReview;
                            
                            let imgDiv = document.getElementById('itemImg');
                            imgDiv.innerHTML="";
                            let image = document.createElement('img');
                            image.src = savedReview.img;
                            imgDiv.appendChild(image);
                            document.getElementById('deleteItemName').innerHTML= savedReview.name;
                            rating=savedReview.rating;
                            let div = document.getElementById('itemImg');
                            let starDiv= document.getElementById('deleteStar');
                            starDiv.innerHTML="";
                            deleteIndex= index;
                             for(let n = 0; n < savedReview.rating; n++){
                                 let spanStar = document.createElement("span");
                                 spanStar.className = "star rated";
                                 console.log(n);
                                 starDiv.appendChild(spanStar);
                                 
                             }
                            
                                                        
                            let activeModal = document.getElementById("deleteModal");
                            activeModal.classList.add('active');
                            let hideModal = document.getElementById("reviewModal");
                            hideModal.classList.remove('active');
                        }
                        
                    });
                    reviewList.appendChild(header);
                    reviewList.appendChild(ul);
                }
            }
            else {
                header.innerHTML = "You do not have any reviews. Please use the Add Review button on the top right corner to create a Review. ";
            }
        }
        
       
    }
};
app.initialize();