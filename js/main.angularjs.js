var obj_NgApp = angular.module('app_keep', []);

obj_NgApp.controller('ctr_keep', function ($scope, $http, $document, $window) {
    
    var mlabMongoDbHelper;
    var tableHelper;
            
    $document.ready(function () {
        mlabMongoDbHelper = new MlabMongoDbHelper($scope.apiKey, $http);
    });
    
    $scope.setApikey = function() {
        mlabMongoDbHelper.setApikey($scope.apiKey);
    }

    $scope.searchMemo = function() {
        var queryObj = {};
        queryObj.db = "azure";
        queryObj.col = "memo";
        queryObj.sortCriteria = '{"reg_date": -1}';
        queryObj.queryCriteria = '{"title": {"$regex": "' + ($scope.searchKeyword || '') + '"}}';
        mlabMongoDbHelper.getDocument(queryObj, function(data) {
            $scope.tableData = data;
            $scope.newMemo();        
        });
    }

    $scope.newMemo = function() {
        $scope.selectedId = "";
        $scope.selectedTitle = "";
        $scope.selectedContents = "";

        $scope.newBool = true;

    }

    $scope.addMemo = function() {
        var queryObj = {};
        queryObj.db = "azure";
        queryObj.col = "memo";
        queryObj.insertObj = {"title": $scope.selectedTitle, "contents": $scope.selectedContents, "reg_date": {"$date": new Date().toISOString()}};
        mlabMongoDbHelper.addDocument(queryObj, function() {
            $scope.searchMemo();
        });

    };

    $scope.updateMemo = function() {
        var queryObj = {};
        queryObj.db = "azure";
        queryObj.col = "memo";
        queryObj._id = $scope.selectedId;
        queryObj.updateObj = {"title": $scope.selectedTitle, "contents": $scope.selectedContents, "reg_date": {"$date": new Date().toISOString()}};
        mlabMongoDbHelper.updateDocument(queryObj, function() {
            $scope.searchMemo();
        });

    };

    $scope.deleteMemo = function() {
        var queryObj = {};
        queryObj.db = "azure";
        queryObj.col = "memo";
        queryObj._id = $scope.selectedId;
        mlabMongoDbHelper.deleteDocument(queryObj, function() {
            $scope.searchMemo();
        });

    };

    $scope.selectMemo = function(idx) {

        $scope.selectedId = $scope.tableData[idx]._id.$oid;
        $scope.selectedTitle = $scope.tableData[idx].title;
        $scope.selectedContents = $scope.tableData[idx].contents;
        
        $scope.newBool = false;
    };
    
});