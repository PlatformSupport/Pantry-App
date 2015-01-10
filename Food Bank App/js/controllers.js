angular.module('pntry.controllers', [])

.controller('AppCtrl', function ($state, $scope, $ionicModal, $ionicPopup, User, Food) {
    // Form data for the login modal
    // TODO - this is not explained in the beginning of the tutorial
    $scope.loginData = {
        username: null,
        password: null
    };

    $scope.registerData = {
        username: null,
        password: null,
        email: null,
        displayname: null,
        organizationname: null
    };

    $scope.foodData = {
        Name: null,
        NumberInStock: 0
    };

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (loginmodal) {
        $scope.loginmodal = loginmodal;
    });

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (registermodal) {
        $scope.registermodal = registermodal;
    });

    //open/close routines
    $scope.openLogin = function () {
        $scope.loginmodal.show();
    };
    $scope.closeLogin = function () {
        $scope.loginmodal.hide();
    };
    $scope.openRegister = function () {
        $scope.registermodal.show();
    };
    $scope.closeRegister = function () {
        $scope.registermodal.hide();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        User.login($scope.loginData).then(function (data) {
            if (data.result) {
                localStorage.setItem("token", data.result.access_token);
                $state.go("app.inventory");
                $scope.loginmodal.hide();
            } else {
                $ionicPopup.alert({
                    title: data.message,
                    template: 'Please try again!'
                });
            }
        });

    };

    // Perform the register action when the user submits the registration form
    $scope.doRegister = function () {
        User.register($scope.registerData).then(function (data) {
            if (data.result) {
                //log me in
                $scope.loginData.username = $scope.registerData.username;
                $scope.loginData.password = $scope.registerData.password;
                $scope.doLogin();
                $scope.closeRegister();
                $state.go("app.inventory");
            } else {
                $ionicPopup.alert({
                    title: status.data.message,
                    template: 'Please try again!'
                });
            }
        });
    };

    $scope.testLoginStatus = function () {
        // TODO - this is not done like the way below 
        var token = localStorage.getItem("token");
        User.me(token).then(function (data) {
            console.log(data)
            if (!data.result) {
                $ionicPopup.alert({
                    title: 'Your session has expired',
                    template: 'Please login!'
                });
                //go home
                $state.go("app.home");
            }
        });
    };

    //get all the food items in Food data type
    $scope.getAllFood = function () {
        Food.getAllFood().then(function (data) {
            $scope.inventory = data.result;
            $scope.$apply();
        });
    };
    //add a new food item to the Food data type. Once added, the Id is returned. Send that Id back to the service and retrieve the food item, then update scope
    $scope.addFood = function (food) {
        if (angular.isDefined(food) && angular.isDefined(food.Name)) {
            Food.addFood(food).then(function (data) {
                Food.getOneFood(data.result.Id).then(function (data) {
                    $scope.inventory.push(data.result);
                    $scope.$apply();
                })
            })
        } else {
            $ionicPopup.alert({
                title: 'Food name is required',
                template: 'Please try again!'
            });
        }

    };

    //remove a food item
    $scope.removeFood = function (idx) {
        var food_to_delete = $scope.inventory[idx];

        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete?',
            template: 'Are you sure you want to delete this food item?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                Food.removeFood(food_to_delete.Id).then(function (data) {
                    $scope.inventory.splice(idx, 1);
                    $scope.$apply();
                });
            } else {
                $ionicPopup.alert({
                    title: 'Sorry, there was a problem removing this item',
                    template: 'Please try again!'
                });
            }
        });
    };
    //update the quantity
    $scope.updateFood = function (idx) {

        var food_to_update = $scope.inventory[idx];

        var confirmPopup = $ionicPopup.confirm({
            title: 'Update?',
            template: 'Are you sure you want to update this food item?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                Food.updateFood(food_to_update).then(function (data) {
                    $scope.$apply();
                });
            } else {
                $ionicPopup.alert({
                    title: 'Sorry, there was a problem updating this item',
                    template: 'Please try again!'
                });
            }
        });
    };

    $scope.getNeededFoods = function () {
        Food.getNeededFoods().then(function (data) {
            $scope.neededfood = data.result;
            $scope.$apply();
        });
    };

    $scope.getSortedFoods = function () {
        Food.getSortedFoods().then(function (data) {
            $scope.sortedfood = data.result;
            $scope.$apply();
        });

    };

    var selected = $scope.selected = [];
    //checking or unchecking a checkbox is tracked, and $scope.selected is incremented and decremented
    $scope.updateSelection = function (e, id) {
        var checkbox = e.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        if (action == 'add' & selected.indexOf(id) == -1) selected.push(id);
        if (action == 'remove' && selected.indexOf(id) != -1) selected.splice(selected.indexOf(id), 1);
    };

    //request a donation by sending in the selected Ids and return the number of records updated
    $scope.requestDonation = function () {
        Food.requestDonation($scope.selected).then(function (data) {
            $ionicPopup.alert({
                title: data.result + ' item(s) were requested',
                template: 'Track your requests on the donation requests screen.'
            });
        });
    };

    $scope.getAllRequests = function () {
        Food.getAllRequests().then(function (data) {
            $scope.requestedfood = (data.result);
            $scope.$apply();
        });
    };

    $scope.viewRequest = function (key) {
        Food.getRequestByDate(key).then(function (data) {
            var list = '';
            for (i = 0; i < data.result.length; i++) {
                list = list + ' ' + data.result[i].Name
            }
            $ionicPopup.alert({
                title: 'You requested:',
                template: list
            });
        });
    };
});