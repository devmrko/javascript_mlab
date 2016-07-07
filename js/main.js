var mlabMongoDbHelper;
var tableHelper;

$( document ).ready(function() {
    tableHelper = new TableHelper("dynamicTable");
    mlabMongoDbHelper = new MlabMongoDbHelper($("#apiKey").val() || '');
});

function setApikey() {
    mlabMongoDbHelper.setApikey($("#apiKey").val());
}

function searchMemo() {
    var queryObj = {};
    queryObj.db = "azure";
    queryObj.col = "memo";
    queryObj.sortCriteria = '{"reg_date": -1}';
    queryObj.queryCriteria = '{"title": {"$regex": "' + $("#searchKeyword").val() + '"}}';
    mlabMongoDbHelper.getDocument(queryObj, function(data) {
        tableHelper.drawTable(data);
        newMemo();        
    });
}

function newMemo() {
    $("#selectedId").val("");
    $("#selectedTitle").val("");
    $("#selectedContents").val("");
    
    $("#addButton").show();
    $("#updateButton").hide();
    $("#deleteButton").hide();
    
}

function addMemo() {
    var queryObj = {};
    queryObj.db = "azure";
    queryObj.col = "memo";
    queryObj.insertObj = {"title": $("#selectedTitle").val(), "contents": $("#selectedContents").val(), "reg_date": {"$date": new Date().toISOString()}};
    mlabMongoDbHelper.addDocument(queryObj, function() {
        searchMemo();
    });
        
};

function updateMemo() {
    var queryObj = {};
    queryObj.db = "azure";
    queryObj.col = "memo";
    queryObj._id = $("#selectedId").val();
    queryObj.updateObj = {"title": $("#selectedTitle").val(), "contents": $("#selectedContents").val(), "reg_date": {"$date": new Date().toISOString()}};
    mlabMongoDbHelper.updateDocument(queryObj, function() {
        searchMemo();
    });
    
};

function deleteMemo() {
    var queryObj = {};
    queryObj.db = "azure";
    queryObj.col = "memo";
    queryObj._id = $("#selectedId").val();
    mlabMongoDbHelper.deleteDocument(queryObj, function() {
        searchMemo();
    });
    
};

function selectMemo(idx) {
    $("#selectedId").val($("#id_" + idx).val());
    $("#selectedTitle").val($("#title_" + idx).val());
    $("#selectedContents").val($("#contents_" + idx).val());
    
    $("#addButton").hide();
    $("#updateButton").show();
    $("#deleteButton").show();
};

var TableHelper = function(tableId) {
    var _tableIns = $("#" + tableId);
    
    this.drawTable = function(jsonObj) {
        var inHTML = "";
        $.each(jsonObj, function(index, value){
            var newItem = "<tr>";
            newItem += "<td><input type='text' style='display:none;' value='"+ value._id.$oid + "' id='id_" + index + "'/></td>";
            newItem += "<td><input type='text' value='"+ value.title + "' id='title_" + index + "' disabled/></td>";
            newItem += "<td><label>" + value.reg_date.$date + "</label></td>";            
            newItem += "<td><input type='text' style='display:none;' value='"+ value.contents + "' id='contents_" + index + "'/></td>";
            newItem += "<td><input type='button' value='select' onclick='selectMemo(" + index + ")'/></td>";
            inHTML += newItem + "</tr>";  
        });

        _tableIns.html(inHTML);        
    }
}
