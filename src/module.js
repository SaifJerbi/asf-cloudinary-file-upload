(function() {
	'use strict';

var cloudinaryFileUploadModule = angular.module('cloudinaryFileUpload', [
  'schemaForm',
  'templates', 'cloudinary', 'ngFileUpload'
]);

cloudinaryFileUploadModule.config(CloudinaryFileUploadConfig);
CloudinaryFileUploadConfig.$inject = ['schemaFormDecoratorsProvider', 'sfBuilderProvider'];

function CloudinaryFileUploadConfig(schemaFormDecoratorsProvider, sfBuilderProvider) {

  schemaFormDecoratorsProvider.defineAddOn(
    'bootstrapDecorator',           // Name of the decorator you want to add to.
    'cloudinaryfileupload',                      // Form type that should render this add-on
    'src/templates/asf-cloudinary-file-upload.html',  // Template name in $templateCache
    sfBuilderProvider.stdBuilders   // List of builder functions to apply.
  );
};

cloudinaryFileUploadModule.controller('cloudinaryFileUploadCtrl', CloudinaryFileUploadCtrl);

CloudinaryFileUploadCtrl.$inject = ['$scope', 'Upload','cloudinary'];

  function CloudinaryFileUploadCtrl ($scope,  $upload, cloudinary) {
    var d = new Date();
    cloudinary.config().cloud_name= $scope.form.cloudName;
    cloudinary.config().upload_preset = $scope.form.uploadPreset;
    
    $scope.uploadFiles = function(files){
      $scope.files = files;
      if (!$scope.files) return;
      angular.forEach(files, function(file){
        if (file && !file.$error) {
          file.upload = $upload.upload({
            url: "https://api.cloudinary.com/v1_1/" + cloudinary.config().cloud_name + "/upload",
            skipAuthorization: !$scope.form.skipAuthorization ? false : $scope.form.skipAuthorization, // tell satellizer.js not to add the authorization header
            fields: {
              upload_preset: cloudinary.config().upload_preset,
              tags: 'myphotoalbum',
            },
            file: file
          }).progress(function (e) {
            file.progress = Math.round((e.loaded * 100.0) / e.total);
            file.status = "Uploading... " + file.progress + "%";
          }).success(function (data, status, headers, config) {
            file.result = data;
            file.result.success= true;
            file.status = "Uploaded";
            $scope.model[$scope.form.key] = data;
          }).error(function (data, status, headers, config) {
            file.result = data;
            file.result.failed= true;
            file.status = data.error.message;
          });
        }
      });
    };
}

})();