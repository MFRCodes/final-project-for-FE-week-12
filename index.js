class Wedding {
    constructor(name) {
        this.name = name;
        this.rooms = [];
    }

    addSeat(name, area) {
        this.rooms.push(new Seat(name, area));
    }
}

class Seat {
    constructor(name, area) {
        this.name = name;
        this.area = area;
    }
} 

// On lines 1-17, the constructor method is used with the class named "Wedding". This brings about a part of the class that
// has a name as well as an array known as "rooms". This array is meant for the objects known as "Seat". New objects known as 
// "Seat" are created by taking the parameters "name" and "area" and putting them in the array known as "rooms". 
// The constructor method is used with the class named "Seat". This brings about a part of the class that
// has a name as well as an array known as "area".

class WeddingList {
    static url = 'https://ancient-taiga-31359.herokuapp.com/api/houses';

    static getAllWeddings() {
        console.log("WeddingList class getAllWeddings");
        return $.get(this.url);
    }

    static getWedding(id) {
        console.log(" WeddingList class getWedding");
        return $.get(this.url + `/${id}`);
    }

    static createWedding(wedding) {
        console.log(" WeddingList class createWedding", wedding);
        return $.post(this.url, wedding);
    }

    static updateWedding(wedding) {
        console.log(" WeddingList class updateWedding", wedding);

        return $.ajax({
            url: this.url + `/${wedding._id}`,
            dataType: 'json',
            data: JSON.stringify(wedding),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteWedding(id) {
        console.log(" WeddingList class deleteWedding", id);

        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

// On lines 25-63, The URL that holds the API is defined. With the method known as "getAllWeddings" a message is logged onto the console
// and a GET request is made to take the wedding information. With the method known as "getWedding", a message is logged to the console
// and a GET request is made with the highlighted id in order to take particular wedding information. With the method known as
// "createWedding" a message is logged onto the console alongside the object known as "wedding". A POST request is made to the URL
// so that wedding information with the object known as "wedding" is created. With the method known as "updateWedding", a message is logged
// onto the console with the object known as "wedding". Then, a PUT request is made so that wedding information can be updated.
// With the method known as "deleteWedding", a message is logged onto the console. Then, a DELETE request is made to get rid of the 
// wedding information.

class DOMManager {
    static weddings; 

    static getAllWeddings() {
        console.log("wedding TASK getAllWeddings");
        WeddingList.getAllWeddings().then(weddings => this.render(weddings));
    }

    static createWedding(name) {
        console.log("wedding TASK createWedding, name: ", name);

        WeddingList.createWedding(new Wedding(name))
            .then(() => {
                return WeddingList.getAllWeddings();
            })
            .then((weddings) => this.render(weddings));
    }

    static deleteWedding(id) {
        console.log("wedding TASK deleteWedding", id);
        WeddingList.deleteWedding(id)
            .then(() => {
                return WeddingList.getAllWeddings();
            })
            .then((weddings) => this.render(weddings));
    }

    static addSeat(id) {
        console.log({"wedding TASK addSeat": id, "weddings":this.weddings});
        for (let wedding of this.weddings) {
            if (wedding._id == id) {
                console.log("add seat if id == id");
                wedding.rooms.push(new Seat($(`#${wedding._id}-seat-name`).val(), $(`#${wedding._id}-seat-area`).val()));
                WeddingList.updateWedding(wedding)
                    .then(() => {
                        return WeddingList.getAllWeddings();
                    })
                    .then((weddings) => this.render(weddings));
            }
        }
    }

    static deleteSeat(weddingId, seatId) {
        console.log("wedding TASK deleteSeat", weddingId, seatId);
        for (let wedding of this.weddings) {
            if (wedding._id == weddingId) {
                for (let seat of wedding.rooms) {
                    if (seat._id == seatId) {
                        wedding.rooms.splice(wedding.rooms.indexOf(seat), 1);
                        WeddingList.updateWedding(wedding)
                            .then(() => {
                                return WeddingList.getAllWeddings();
                            })
                            .then((weddings) => this.render(weddings));
                    }
                }
            }
        }
    }

    // On lines 74-134, a static property known as "weddings" is defined so that the wedding list can be retrieved from the server.
    // The method known as "getAllWeddings" from the class known as "weddingList", is called to retrieve the wedding information.
    // The wedding information that is retrieved is then put through the "render" method.
    // The method known as "createWedding" from the class known as "weddingList", is called to retrieve the wedding information.
    // The wedding information that is retrieved is then put through the "render" method after the new wedding is made.
    // The method known as "deleteWedding" from the class known as "weddingList", deletes the wedding information. 
    // The method known as "addSeat" locates the "wedding" with the "id" it goes with by iterating over it.
    // It then provides a new seat to the array known as "rooms". The wedding information is updated with the "updateWedding" method.
    // As for the "deleteSeat" method, it locates the "wedding" with the "id" it goes with by iterating over it.
    // Then, in order to find the seat with the "seatId", it iterates over the array known as rooms. The seat is then taken out of the array
    // known as rooms. The "updateWedding" method updates the wedding. And finally,  the wedding information is retrived again
    // and rendered once the seat is deleted.

    static render(weddings) {
        this.weddings = weddings;
        $('#app').empty();
        for (let wedding of weddings) {
            if (!Array.isArray(wedding.rooms)) {
                wedding.rooms = [];
            }

            $('#app').prepend(
                `
                <div id="${wedding._id}" class="card">
                    <div class="card-header">
                        <h2>${wedding.name}</h2>
                        <button class="btn btn-danger" onClick="DOMManager.deleteWedding('${wedding._id}')">Delete Wedding</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${wedding._id}-seat-name" class="form-control" placeholder="Seat Name">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${wedding._id}-seat-area" class="form-control" placeholder="Seat Area">
                                </div>
                            </div>
                            <button id="${wedding._id}-new-seat" onClick="DOMManager.addSeat('${wedding._id}')" class="btn btn-primary form-control">Add Seat</button>
                        </div>
                    </div>
                </div><br>`
            );

            for (let seat of wedding.rooms) {
                $(`#${wedding._id}`).find('.card-body').append(
                    `
                    <p>
                    <span id="name-${seat._id}"><strong>Name: </strong> ${seat.name}</span>
                    <span id="area-${seat._id}"><strong>Area: </strong> ${seat.area}</span>
                    <button class="btn btn-danger" onClick="DOMManager.deleteSeat('${wedding._id}', '${seat._id}')">Delete Seat</button>
                    </p>`
                );
            }
        }
    }
}

$('#create-new-wedding').click(() => {
    DOMManager.createWedding($('#new-wedding-name').val());
    $('#new-wedding-name').val('');
});

DOMManager.getAllWeddings();

// On lines 147-197, the parameter known as "weddings", is assigned to "this.weddings", a static property. The element known as
// "#app", is emptied so that it can render the updated wedding list. For the property known as "wedding.rooms", if it's not an array,
// the method initializes it as an empty array. As for each wedding being rendered, for each individual one, a new "div" with a class called
// "card" is added to the element known as "#app". The "card-header" in the "div" has the wedding's name and button. The "card-body" 
// in the "div" has the seat name and area and button to add new seats.
// As for rendering each seat, every seat in the array known as "wedding.rooms", has a "p" element added to "card-body" to the wedding.
// When the button called "#create-new-wedding" is clicked, the "DOMManager.createWedding" method is called.
// And finally, the "DOMManager.getAllWeddings" method is called to retrieve and render the weddings. 