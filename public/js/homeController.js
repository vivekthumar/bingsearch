angular.module('bingSearch').controller('homeController', function($rootScope,$scope, $http, $timeout,$location) {
	$scope.form = {};
	$scope.form.dataArr = [];
	$scope.btnsubmit = function (){
		if($scope.form.query && $scope.form.query != ''){
			var obj = {"query" : $scope.form.query}
			angular.element(".progress-indicator").show();
			$http.post("/searchFromBing/",JSON.stringify(obj)).success(function(data, status) {
				angular.element(".progress-indicator").hide();
				if(data && data.status == 'success'){
					//console.log(data.data)
					$scope.form.dataArr = data.data;
				}else{
					$scope.form.dataArr = [];
				}
			});
		}else{
			alert("Please enter key word")
		}
		
	};

});