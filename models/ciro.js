const fs = require('fs');
const path = require('path');
const { getCurrentDate, datediff, formatDate } = require('../helpers/date_helper');

class Ciro {

    constructor() {

        this.filename = path.resolve(__dirname, '../data/ciro_photos.json');

        try {
            let data = JSON.parse(fs.readFileSync(this.filename, { encoding: 'utf8', flag: 'r' }));

            if (data.date_control) {
                
                let datearr = data.date_control.split('-');
                
                this.date = new Date(datearr[0], datearr[1] - 1, datearr[2]);
            } else {
                this.date = getCurrentDate();
            }

            this.photos = data.photos || [];
            
            this.daily_photo = data.daily_photo || "";

        } catch (err) {
            throw Error("ciro_photos.json Error!");
        }
    }

    saveData() {
        
        let dateString = formatDate(getCurrentDate());
        
        let jsonData = {
            date_control: dateString,
            daily_photo: this.daily_photo,
            photos: this.photos
        };

        let jsonDataString = JSON.stringify(jsonData);

        fs.writeFileSync(this.filename, jsonDataString);
    }

    getDailyPhoto() {
        const daily = this.daily_photo;
        let currentDate = getCurrentDate();
        let photo = {};
        
        if (datediff(this.date, currentDate) > 0 || daily === "") {
            this.date = getCurrentDate();
            this.saveData();
            
            let photosWithoutDaily = this.photos.filter(function (obj) {
                return obj.image !== daily;
            });
            
            photo = photosWithoutDaily[Math.floor(Math.random() * photosWithoutDaily.length)];
            
            this.daily_photo = photo.image;
            this.saveData();
        }
        else {
            let photoArr = this.photos.filter(function (obj) {
                return obj.image === daily;
            });
            
            photo = photoArr[0];
        }
        
        return photo;
    }
    
    getAllPhotos() {
        return this.photos;
    }
    
    getPhoto(photo) {
        let photoArr = this.photos.filter(function (obj) {
            return obj.image === photo;
        });

        return photoArr[0];
    }
}

module.exports = {
    Ciro
};