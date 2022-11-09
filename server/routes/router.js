const express = require('express');
const route = express.Router()

const services = require('../services/render');
const controller = require('../controller/controller');
const { requiresAuth } = require('express-openid-connect');

/**
 *  @description Root Route
 *  @method GET /
 */
route.get('/', requiresAuth(), services.homeRoutes);

/**
 *  @description add users
 *  @method GET /add-user
 */
route.get('/add-user', requiresAuth(), services.add_user)

/**
 *  @description for update user
 *  @method GET /update-user
 */
route.get('/update-user', requiresAuth(), services.update_user)

// API
route.post('/api/users', controller.create);
route.get('/api/users', controller.find);
route.put('/api/users/:id', controller.update);
route.delete('/api/users/:id', controller.delete);


module.exports = route