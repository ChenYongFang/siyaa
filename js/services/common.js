/*
 * application's common services
 * autohr: Jeremy
 * date: 2014.04.16
 * defined basic service for the application
 * Version: 1.0
 * License: siyaa inc
 */

 define(['js/app'],function(app){

    /* common user Auth service */
    app.factory('AuthService',['DataService','Session',function(DataService,Session){
        return {
            login:function(credentials){
                return DataService.post({url:'usermgr/user/mobile/login',data:credentials,callback:function(res){
                    //store user infomation.
                    Session.create(res.id,res.userId,res.userRole,res.userInfo);
                }});
            },
            isAuthenticated:function(){
                return !!Session.userId;
            },
            isAuthorized:function(authorizedRoles){
                if (!angular.isArray(authorizedRoles)) {
                    authorizedRoles = [authorizedRoles];
                }
                return (this.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
            }
        }
    }]);
    app.factory('AuthInterceptor',['$rootScope','$q','AUTH_EVENTS',function($rootScope,$q,AUTH_EVENTS){
        return {
            responseError:function(response){
                switch(response.status){
                    case 401:
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated,response);
                        break;
                    case 403:
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized,response);
                        break;
                    case 419:
                    case 440:
                        $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout,response);
                        break;
                }
                return $q.reject(response);
            }
        };
    }]);
    //define user session service
    app.service('Session',function(){
        this.create = function (sessionId, userId, userRole, userInfo) {
            this.id = sessionId;
            this.userId = userId;
            this.userRole = userRole;
            this.userInfo = userInfo;
        };
        this.destroy = function () {
            this.id = null;
            this.userId = null;
            this.userRole = null;
            this.userInfo = null;
        };
        return this;
    });
    //define all of the available login state event 
    app.constant('AUTH_EVENTS',
        {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
            sessionTimeout: 'auth-session-timeout',
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized'
        }
    );
    //define all of the role rights
    app.constant('USER_ROLES',
        {
            all: '*',
            admin: 'admin',
            editor: 'editor',
            guest: 'guest'
        }
    );


    /* web modal service */
    app.factory('ModalService',['$modal','$log',function($modal,$log){
        //show a modal
        function show(obj){

            // default template
            var defaultTpl = '';

            if(obj.templateUrl){
                // set templateUrl
                defaultTpl = obj.templateUrl;
            }else if(obj.template){
                //inline template 
                $modal.open({
                    template:obj.template,
                    controller:obj.controller,
                    resolve:obj.resolve
                });
                //jump out of here
                return true;
            }else{
                // set template to be default.
                defaultTpl = '/views/angularui/modal/modal.htm';
            }

            //tmpUrl,title,content,controller,resolve
            $modal.open({
                templateUrl:defaultTpl,
                controller:obj.controller,
                resolve:obj.resolve
            });
        }

        // close a modal
        function close($modalInstance){
            $modalInstance.close();
        }

        return{
            //advance modal service
            show:show,
            // open a modal.
            open:function(title,content){
                show({
                    controller:function($scope,$modalInstance){
                        $scope.title = title;
                        $scope.content = content;
                        $scope.close = function(){
                            close($modalInstance);
                        }
                    }
                });
            },
            // open a modal with default title
            openWithDefaultTitle:function(content){
                show({
                    controller:function($scope,$modalInstance){
                        $scope.title = '温馨提示';
                        $scope.content = content;
                        $scope.close = function(){
                            close($modalInstance);
                        }
                    }
                });
            }
        }
    }]);

    /* basic data service */
    app.factory('DataService',['$q','$http','$log','ModalService',function($q,$http,$log,ModalService){

        var baseDataUrl = '/embs/';

        function preCallback(data,callback,status,errCollback){
            if(errCollback && typeof(errCollback) === "function"){

                //Http请求异常处理
                errCollback(data,status);

            }else{

                if(data._code){
                    //包含数据接口返回的状态
                    switch(data._code){
                        //异常代码判断
                        case 10:
                        case 100:
                        ModalService.openWithDefaultTitle(ERRCODEMSG[data._code]);
                        break;
                        default:
                            callback(data); //正常数据请求
                            break;
                        }
                    }else{
                    callback(data); //正常数据请求
                }
            }
        }

        return {
            //advanced get request to server
            get:function(options){
                // default to be no cache
                if(!options.cache)
                    options.cache = false;
                $http.get(baseDataUrl + options.url,{params:options.params,cache:options.cache}).success(function(data){
                    preCallback(data,options.callback);
                    $log.debug('GetHttp: ',options.url,options.params,data);
                }).error(function(data,status){
                    $log.error('GetHttpError：' + status + '  Url:' + options.url + '  Params:',options.params);
                    preCallback(data,options.callback,status,options.errCollback);
                });
            },
            //simple request to server with future return data
            request:function(url,params,cache){

                /*var defer = $q.defer();
                this.get({url:url,params:params,cache:cache,callback:function(data){
                    defer.resolve(data);
                }});
                return defer.promise;*/

            },
            //advanced post request with normal form data to server
            post:function(options){
                /* replace the angularjs's default post behavior to not be normal form post behavior */
                $http.defaults.headers.post = {'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'};

                $http.post(baseDataUrl + options.url,angular.params(options.data)).success(function(data){
                    preCallback(data,options.callback);
                    $log.debug('PostHttp: ',options.url,options.data,data);
                }).error(function(data,status){
                    $log.error('PostHttpError：' + status +  '  Url:' + options.url + '  Params:',options.params);
                    preCallback(data,options.callback,status,options.errCollback);
                });
            },
            //advanced post request with json data to server
            postJson:function(options){
                $http.post(baseDataUrl + options.url,angular.params(options.data)).success(function(data){
                    preCallback(data,options.callback);
                    $log.debug('PostJsonHttp: ',options.url,options.data,data);
                }).error(function(data,status){
                    $log.error('PostJsonHttpError：' + status +  '  Url:' + options.url + '  Params:',options.params);
                    preCallback(data,options.callback,status,options.errCollback);
                });
            }
        }
    }]);
 });