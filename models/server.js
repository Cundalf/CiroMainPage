const express = require('express');
const path = require('path');
const hbs = require('hbs');
const { Ciro } = require('./ciro');

class Server {  
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8000;
        this.ciroController = new Ciro();
    }
    
    run() {
        this._initialConfig();
        this._routesConfig();
        
        this.app.listen(this.port, () => {
            console.log(`Server ready in port: ${this.port}`);
        });
    }
    
    _initialConfig() {
        // Static path
        this.app.use(express.static(path.resolve(__dirname, '../public')));
        
        // Express HBS engine
        require('../helpers/hbs_helper');

        hbs.registerPartials(path.resolve(__dirname, '../views/partials'));
        this.app.set('view engine', 'hbs');
    }
    
    _routesConfig() {
        this.app.get('/', (req, res) => {
            res.render('home', {
                daily: this.ciroController.getDailyPhoto(),
                active: {
                    home: true
                },
                footer: true
            });
        });

        this.app.get('/private', (req, res) => {
            res.render('private', {
                photos: this.ciroController.getAllPhotos(),
                active: {
                    private: true
                },
                footer: true
            });
        });
        
        this.app.get('/photo', (req, res) => {
            
            let img = req.query.photo;
            let photo = this.ciroController.getPhoto(img);
            
            console.log(req.query);
            
            if(photo === undefined) {
                res.redirect('/404');
                return;
            }
            
            res.render('photo', {
                photo: this.ciroController.getPhoto(img),
                footer: true
            });
        });
        
        this.app.get('*', function (req, res) {
            res.status(404).render('404');
        });
    }
}

module.exports = Server;