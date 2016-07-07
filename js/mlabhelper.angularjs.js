var MlabMongoDbHelper = function (apikey, http) {
    var _apikey = apikey;
    var _http = http;
    var _mLabRestApiUrl = "https://api.mlab.com/api/1";
    
    this.setApikey = function(apikey) {
        _apikey = apikey;
    }
    
    var specialCharChanger = function(str) {
        return str.replace(/ /gi, '%20').replace(/"/gi, '%22');
    }
    
    var errorHandler = function(data, status, headers, config) {
        alert('mlab rest api error: ' + status);
    }
    
    var urlCreater = function(queryObj) {
        var sendUrl = _mLabRestApiUrl + "/databases/" + queryObj.db
                    + "/collections/" + queryObj.col
                    + (queryObj._id == undefined ? "" : "/" + queryObj._id)
                    + "?apiKey=" + _apikey
                    + (queryObj.sortCriteria == undefined ? "" : "&s=" + queryObj.sortCriteria)
                    + (queryObj.queryCriteria == undefined ? "" : "&q=" + queryObj.queryCriteria);
        return specialCharChanger(sendUrl);
    }
    
    this.getDocument = function(queryObj, callback) {
        
        if(queryObj == undefined || queryObj.db == undefined || queryObj.col == undefined || callback == undefined)
            return;
        
        _http.get(urlCreater(queryObj)).success(callback).error(function (data, status, headers, config) {
            errorHandler(data, status, headers, config);            
        });        
        
        
    }
    
    this.addDocument = function(queryObj, callback) {
        
        if(queryObj == undefined || queryObj.db == undefined || queryObj.col == undefined || queryObj.insertObj == undefined)
            return;
        
        _http.post(urlCreater(queryObj), JSON.stringify(queryObj.insertObj)).success(callback).error(function (data, status, headers, config) {
            errorHandler(data, status, headers, config);    
        });        
        
    }

    this.updateDocument = function(queryObj, callback) {
        
        if(queryObj == undefined || queryObj.db == undefined || queryObj.col == undefined 
           || queryObj._id == undefined || queryObj.updateObj == undefined)
            return false;
        
        _http.put(urlCreater(queryObj), JSON.stringify({"$set": queryObj.updateObj})).success(callback).error(function (data, status, headers, config) {
            errorHandler(data, status, headers, config);    
        }); 
                
    }
    
    this.deleteDocument = function(queryObj, callback) {
        
        if(queryObj == undefined || queryObj.db == undefined || queryObj.col == undefined 
           || queryObj._id == undefined)
            return false;
        
        _http.delete(urlCreater(queryObj)).success(callback).error(function (data, status, headers, config) {
            errorHandler(data, status, headers, config);    
        });         
        
    }
    
}
