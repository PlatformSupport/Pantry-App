angular.module('pntry.services', [])

.factory('API', function () {

    var api_key = '';

    return api_key;
})

.factory('User', function (API) {

    var el = new Everlive({
        apiKey: API,
        scheme: 'https',
        token: localStorage.getItem('token')
    });
    return {
        register: function (registerData) {
            return el.Users.register(
                    registerData.username,
                    registerData.password, {
                        Email: registerData.email,
                        DisplayName: registerData.displayname,
                        OrganizationName: registerData.organizationname
                    })
                .then(function (data) {
                        return data;
                    },
                    function (error) {
                        return error;
                    });
        },
        login: function (loginData) {
            return el.Users.login(
                    loginData.username,
                    loginData.password)
                .then(function (data) {
                        return data;
                    },
                    function (error) {
                        return error;
                    });
        },
        me: function () {
            return el.Users.currentUser()
                .then(function (data) {
                        return data;
                    },
                    function (error) {
                        return error;
                    });
        }
    }
})

.factory('Food', function (API) {
    //let's call Everlive using our token
    var el = new Everlive({
        apiKey: API,
        scheme: 'https',
        token: localStorage.getItem('token')
    });
    //query the Food data type
    var data = el.data('Food');
    var query = new Everlive.Query();
    return {
        //read the Food data
        getAllFood: function () {
            return data.get()
                .then(function (data) {
                        return data;
                    },
                    function (error) {
                        return error;
                    });
        },
        //retrieve added item
        getOneFood: function (id) {
            return data.getById(id)
                .then(function (data) {
                        return data;
                    },
                    function (error) {
                        return error;
                    });
        },
        //add item, setting requested date to null 
        addFood: function (foodData) {
            return data.create({
                    Name: foodData.Name,
                    NumberInStock: parseInt(foodData.NumberInStock),
                    RequestDate: null
                })
                .then(function (data) {
                        return data;
                    },
                    function (error) {
                        return error;
                    });

        },
        //remove an item
        removeFood: function (id) {
            return data.destroySingle({
                    Id: id
                })
                .then(function (data) {
                        return data;
                    },
                    function (error) {
                        return error;
                    });

        },
        //update an item
        updateFood: function (foodData) {
            return data.updateSingle({
                    Id: foodData.Id,
                    'NumberInStock': parseInt(foodData.NumberInStock)
                })
                .then(function (data) {
                        return data;
                    },
                    function (error) {
                        return error;
                    });

        },
        getNeededFoods: function () {
            query.where().lte('NumberInStock', 2);
            return data.get(query)
                .then(function (data) {
                        return data;
                    },
                    function (error) {
                        return error;
                    });
        },
        getSortedFoods: function () {
            query.order('NumberInStock');
            return data.get(query)
                .then(function (data) {
                        return data;
                    },
                    function (error) {
                        return error;
                    });
        },
        requestDonation: function (foodData) {
            var now = new Date();
            var model = {
                'RequestDate': now
            };
            query.where().isin("Id", foodData).done();
            return data.update(model, query)
                .then(function (data) {
                        return data;
                    },
                    function (error) {
                        return error;
                    });
        },
        getAllRequests: function () {
            query.where().ne('RequestDate', null);
            return data.get(query)
                .then(function (data) {
                        return data;
                    },
                    function (error) {
                        return error;
                    });
        },
        getRequestByDate: function (key) {
            var newkey = moment().format('MMMM Do YYYY, h:mm:ss');
            query.where().gte("RequestDate", newkey).lte("RequestDate", newkey).done();
            return data.get(query)
                .then(function (data) {
                        return data;
                    },
                    function (error) {
                        return error;
                    });
        }
    }
})
