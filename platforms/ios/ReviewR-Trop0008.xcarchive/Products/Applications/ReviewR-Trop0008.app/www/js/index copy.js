/*****************************************************************
File: index.js
Author: Marjan Tropper
Description:

The GiftR app.
- There are two mains screens and two modal popups
- The first screen is the list of people that you have added to the app along with their birthdays
- Each person will have an arrow to navigate to the second page, a list of gift ideas for that person
-the person screen will also have a button to open a modal popup to add a new person.
-Clicking on a person's name from the list, will also open the same modal popup but it allows the user to edit the person instead of adding a new one.
- On the gift page there will be a button for adding a new idea to the list.
- The modal popup for adding gifts will ask for the idea, the location where it can be bought, a URL where it can be found online, and a cost. The list of gifts will display the idea and then optionally the other three things about the idea.
- If any of the other fields are empty then they are not displayed in the list
- There is also  a delete button for each idea so it can be removed.
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
        document.getElementById("cancelAddReview").addEventListener("click", cancelModal);
        document.getElementById("saveAddReview").addEventListener("click", saveModal);
        document.getElementById("closeAddReview").addEventListener("touchstart", closeModal);
        getLocalStorage();
        listReviews();
        
       // document.getElementById("cancelAddGift").addEventListener("click", cancelModal);
      //  document.getElementById("saveAddGift").addEventListener("click", saveModal);
      //  document.getElementById("closeAddGift").addEventListener("touchstart", closeModal);
        /*
        if (app.currentReview.name) {
            document.getElementById("addGiftName").innerHTML = "Gift idea for " + app.currentReview.name;
        }
        */

        function closeModal(ev) {
            let clickedLink = ev.target.id;
            let activeModal;
            switch (pageId) {
            case "reviewList":
                document.getElementById("itemName").value = "";
                document.getElementById("doBirth").value = "";
                document.getElementById("headertitle").innerHTML = "Add Person";
                document.getElementById("personError").innerHTML = "";
                if (EditFlag) {
                    // if edit is cancelled empty fields
                    app.currentReview = null;
                }
                EditFlag = false;
                break;
            case "giftList":
                document.getElementById("giftError").innerHTML = "";
                document.getElementById("giftIdea").value = "";
                document.getElementById("giftStore").value = "";
                document.getElementById("giftURL").value = "";
                document.getElementById("giftCost").value = "";
                break;
            default:
                // if nothing matches do nothing
            }
        }

        function cancelModal(ev) {
            ev.preventDefault;
            let clickedLink = ev.target.id;
            let activeModal;
            switch (pageId) {
            case "reviewList":
                document.getElementById("itemName").value = "";
                document.getElementById("doBirth").value = "";
                document.getElementById("headertitle").innerHTML = "Add Person";
                document.getElementById("personError").innerHTML = "";
                activeModal = document.getElementById("reviewModal");
                activeModal.classList.remove('active');
                if (EditFlag) {
                    // if edit is cancelled empty fields
                    app.currentReview = null;
                }
                EditFlag = false;
                break;
            case "giftList":
                activeModal = document.getElementById("giftModal");
                activeModal.classList.remove('active');
                document.getElementById("giftError").innerHTML = "";
                document.getElementById("giftIdea").value = "";
                document.getElementById("giftStore").value = "";
                document.getElementById("giftURL").value = "";
                document.getElementById("giftCost").value = "";
                break;
            default:
                // if nothing matches do nothing
            }
        }

        function showModal() {
            let activeModal;
            switch (pageId) {
            case "reviewList":
                activeModal = document.getElementById("reviewModal");
                activeModal.classList.add('active');
                break;
            case "giftList":
                activeModal = document.getElementById("giftModal");
                activeModal.classList.add('active');
                break;
            default:
                // if nothing matches do nothing
            }
        }

        function saveModal() {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50
                , destinationType: Camera.DestinationType.FILE_URI
            });

            function onSuccess(imageURI) {
                let div = document.getElementById('cameraimage');
                var image = document.createElement('img');
                image.src = imageURI;
                div.appendChild(image);
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
            let activeModal;
            switch (pageId) {
            case "reviewList":
                let itemName = document.getElementById("itemName").value;
                let doBirth = document.getElementById("doBirth").value
                if (itemName != "" && doBirth != "") {
                    if (EditFlag) {
                        let indexcheck = app.savedListReviews.people.map(function (e) {
                            return e.id;
                        }).indexOf(app.currentReview.id);
                        app.savedListReviews.people[indexcheck].name = itemName;
                        app.savedListReviews.people[indexcheck].dob = doBirth;
                        app.savedListReviews.people.sort(function (a, b) {
                            return (moment(a.dob, "YYYY-MM-DD").format("MM-DD") > moment(b.dob, "YYYY-MM-DD").format("MM-DD")) ? 1 : (moment(a.dob, "YYYY-MM-DD").format("MM-DD") < moment(b.dob, "YYYY-MM-DD").format("MM-DD")) ? -1 : 0;
                        });
                    }
                    else {
                        let id = Date.now();
                        let profile = {
                            "id": id
                            , "name": itemName
                            , "dob": doBirth
                            , "ideas": []
                        }
                        app.savedListReviews.people.push(profile);
                        if (app.savedListReviews.people.length > 1) {
                            app.savedListReviews.people.sort(function (a, b) {
                                return (moment(a.dob, "YYYY-MM-DD").format("MM-DD") > moment(b.dob, "YYYY-MM-DD").format("MM-DD")) ? 1 : (moment(a.dob, "YYYY-MM-DD").format("MM-DD") < moment(b.dob, "YYYY-MM-DD").format("MM-DD")) ? -1 : 0;
                            });
                        }
                    }
                    setLocalStorage();
                    listReviews();
                    EditFlag = false;
                    app.currentReview = null;
                    document.getElementById("itemName").value = "";
                    document.getElementById("doBirth").value = "";
                    document.getElementById("headertitle").innerHTML = "Add Person";
                    activeModal = document.getElementById("reviewModal");
                    activeModal.classList.remove('active');
                    document.getElementById("personError").innerHTML = "";
                }
                else {
                    document.getElementById("personError").innerHTML = "Please insert  both Name and Birtday!";
                }
                break;
            case "giftList":
                if (app.currentReview) {
                    let giftIdea = document.getElementById("giftIdea").value;
                    if (giftIdea != "") {
                        let giftStore = document.getElementById("giftStore").value;
                        let giftURL = document.getElementById("giftURL").value;
                        let giftCost = document.getElementById("giftCost").value;
                        let giftId = Date.now();
                        if (giftURL) {
                            var pattern = /^http(s)?:\/\//;
                            if (!pattern.test(giftURL)) {
                                giftURL = "http://" + giftURL
                            }
                        }
                        let gift = {
                            "giftid": giftId
                            , "idea": giftIdea
                            , "at": giftStore
                            , "url": giftURL
                            , "cost": giftCost
                        }
                        let indexcheck = app.savedListReviews.people.map(function (e) {
                            return e.id;
                        }).indexOf(app.currentReview.id);
                        app.currentReview.ideas.push(gift);
                        app.savedListReviews.people[indexcheck].ideas = app.currentReview.ideas;
                        setLocalStorage();
                        listGifts();
                        activeModal = document.getElementById("giftModal");
                        activeModal.classList.remove('active');
                        document.getElementById("giftIdea").value = "";
                        document.getElementById("giftStore").value = "";
                        document.getElementById("giftURL").value = "";
                        document.getElementById("giftCost").value = "";
                        document.getElementById("giftError").innerHTML = "";
                    }
                    else {
                        document.getElementById("giftError").innerHTML = "Please insert a gift idea!";
                    }
                }
                break;
            default:
                // if nothing matches do nothing
            }
        }
        /**************************** local storage functions ********************************/
        
        function setLocalStorage() {
            if (localStorage) {
                localStorage.setItem("reviewr-trop0008", JSON.stringify(app.savedListReviews));
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
                    header.innerHTML = "You do not have any contacts listed. Please use the Add Person button on the top right corner to create a contact. "
                }
                else {
                    header.innerHTML = "Reviews list:"
                    let ul = document.createElement("ul");
                    ul.className = "table-view";
                    app.savedListReviews.people.forEach(function (savedReview, index) {
                        // the saved list items are created here
                        /*
        {"reviews":[
  {"id":237428374, "name":"Timmies", "rating":4, "img":"path/and/filename/on/device.png"},
  {"id":123987944, "name":"Starbucks", "rating":4, "img":"path/and/filename/on/device.png"}
]}
        */
                        
                        let li = document.createElement("li");
                        li.className = "table-view-cell " ;
                        let span = document.createElement("span");
                        span.className = "media-object pull-right icon icon-right-nav";
                        let img = document.createElement("img");
                        img.className = "media-object  pull-left";
                        img.src =  savedReview.img;
                        let div = document.createElement("div");
                        div.className = "media-body ";
                        let name = savedReview.name;
                        div.innerHTML += " " + name;
                        let p = document.createElement("p");
                        p.innerHTML =  savedReview.rating + " Stars";
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
                            document.getElementById("itemName").value = person.name;
                            document.getElementById("doBirth").value = person.dob;
                            document.getElementById("headertitle").innerHTML = "Edit Person";
                            deleteModal
                            let activeModal = document.getElementById("deleteModal");
                            activeModal.classList.add('active');
                            let hideModal = document.getElementById("reviewModal");
                            hideModal.classList.remove('active');
                        }
                        
                        
                        
                        
                        /*
                        let li = document.createElement("li");
                        li.className = "table-view-cell ";
                        let span = document.createElement("span");
                        span.className = "name";
                        let linkEdit = document.createElement("a");
                        linkEdit.href = "#reviewModal";
                        linkEdit.innerHTML = person.name;
                        let linkideas = document.createElement("a");
                        linkideas.href = "gifts.html";
                        linkideas.className = "navigate-right pull-right";
                        let span2 = document.createElement("span");
                        span2.className = "dob";
                        span2.innerHTML = moment(person.dob).format("MMMM Do");
                        linkideas.appendChild(span2);
                        span.appendChild(linkEdit);
                        let today = moment().format("MMMM Do");
                        let birdaydate = moment(person.dob).format("MMMM Do");
                        if ((moment(birdaydate, "MMMM Do") - moment(today, "MMMM Do")) < 0) {
                            li.classList.add("pastdate");
                        }
                        li.appendChild(span);
                        li.appendChild(linkideas);
                        ul.appendChild(li);
                        linkEdit.addEventListener("touchstart", editProfile);
                        linkideas.addEventListener("touchstart", viewGifts);

                        function editProfile(ev) {
                            ev.preventDefault;
                            EditFlag = true;
                            app.currentReview = person;
                            document.getElementById("itemName").value = person.name;
                            document.getElementById("doBirth").value = person.dob;
                            document.getElementById("headertitle").innerHTML = "Edit Person";
                        }

                        function viewGifts(ev) {
                            ev.preventDefault;
                            app.currentReview = person;
                        }*/
                    });
                    
                    profileList.appendChild(header);
                    profileList.appendChild(ul);
                }
            }
            else {
                showModal();
            }
        }
        /********************* list gifts ********************/
        function listGifts() {
            let giftList = document.getElementById('giftList');
            giftList.innerHTML = "";
            let header = document.createElement("h3");
            header.className = "giftheader";
            if (app.currentReview.ideas != null) {
                if (app.currentReview.ideas.length == 0) {
                    header.innerHTML = "You have not added any gift ideas for " + app.currentReview.name + ". Please use the Add Idea button on the top right corner to create a gift idea. ";
                    giftList.appendChild(header);
                }
                else {
                    header.innerHTML = "Gift Ideas for " + app.currentReview.name;
                    let ul = document.createElement("ul");
                    ul.className = "table-view";
                    app.currentReview.ideas.forEach(function (idea, index) {
                        // the saved list items are created here
                        let li = document.createElement("li");
                        li.className = "table-view-cell media";
                        let span = document.createElement("span");
                        span.className = "pull-right icon icon-trash midline";
                        let div = document.createElement("div");
                        div.className = "media-body";
                        div.innerHTML = idea.idea;
                        if (idea.at) {
                            let p1 = document.createElement('p');
                            p1.innerHTML = idea.at;
                            div.appendChild(p1);
                        }
                        if (idea.url) {
                            let p2 = document.createElement('p');
                            let urlLink = document.createElement('a');
                            urlLink.href = idea.url;
                            urlLink.innerHTML = idea.url;
                            urlLink.target = "_system";
                            p2.appendChild(urlLink);
                            div.appendChild(p2);
                        }
                        if (idea.cost) {
                            let p3 = document.createElement('p');
                            p3.innerHTML = idea.cost;
                            div.appendChild(p3);
                        }
                        li.appendChild(span);
                        li.appendChild(div);
                        ul.appendChild(li);
                        span.addEventListener("click", deleteIdea);

                        function deleteIdea(ev) {
                            ev.preventDefault;
                            let indexcheck = app.savedListReviews.people.map(function (e) {
                                return e.id;
                            }).indexOf(app.currentReview.id);
                            let indexidea = app.currentReview.ideas.map(function (e) {
                                return e.giftid;
                            }).indexOf(idea.giftid);
                            app.currentReview.ideas.splice(indexidea, 1);
                            listGifts();
                            app.savedListReviews.people[indexcheck].ideas = app.currentReview.ideas;
                            setLocalStorage();
                        }

                        function viewGifts(ev) {
                            ev.preventDefault;
                            app.currentReview = person;
                        }
                    });
                    giftList.appendChild(header);
                    giftList.appendChild(ul);
                }
            }
            else {
                showModal();
            }
        }
    }
};
app.initialize();