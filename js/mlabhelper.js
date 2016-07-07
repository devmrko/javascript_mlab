var MlabMongoDbHelper = function (apikey) {
    var _apikey = apikey;
    var _mLabRestApiUrl = "https://api.mlab.com/api/1";
    
    this.setApikey = function(apikey) {
        _apikey = apikey;
    }
    
    var specialCharChanger = function(str) {
        return str.replace(/ /gi, '%20').replace(/"/gi, '%22');
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
        
        $.ajax( { url: urlCreater(queryObj),
		  type: "GET",
		  async: true,
		  timeout: 300000,
		  success: callback,
		  error: function (xhr, status, err) {
              console.dir(err);
          } 
        });
        
    }
    
    this.addDocument = function(queryObj, callback) {
        
        if(queryObj == undefined || queryObj.db == undefined || queryObj.col == undefined || queryObj.insertObj == undefined)
            return false;
        
        $.ajax( { url: urlCreater(queryObj),
		  type: "POST",
		  data: JSON.stringify(queryObj.insertObj),
          contentType: "application/json",
          success: callback,
		  error: function (xhr, status, err) {
              console.dir(err);
              return false;
          } 
        });
        
    }

    this.updateDocument = function(queryObj, callback) {
        
        if(queryObj == undefined || queryObj.db == undefined || queryObj.col == undefined 
           || queryObj._id == undefined || queryObj.updateObj == undefined)
            return false;
        
        $.ajax( { url: urlCreater(queryObj),
		  type: "PUT",
		  data: JSON.stringify({"$set": queryObj.updateObj}),
          contentType: "application/json",
          success: callback,
		  error: function (xhr, status, err) {
              console.dir(err);
              return false;
          } 
        });
        
    }
    
    this.deleteDocument = function(queryObj, callback) {
        
        if(queryObj == undefined || queryObj.db == undefined || queryObj.col == undefined 
           || queryObj._id == undefined)
            return false;
        
        $.ajax( { url: urlCreater(queryObj),
		  type: "DELETE",
          async: true,
          timeout: 300000,
		  data: JSON.stringify({}),
          contentType: "application/json",
          success: callback,
		  error: function (xhr, status, err) {
              console.dir(err);
              return false;
          } 
        });
        
    }
    
}
