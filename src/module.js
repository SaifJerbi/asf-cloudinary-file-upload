(function() {
	'use strict';

var cloudinaryFileUploadModule = angular.module('cloudinaryFileUpload', [
  'schemaForm',
  'templates', 'cloudinary', 'ngFileUpload'
]);

cloudinaryFileUploadModule.config(function (schemaFormDecoratorsProvider, sfBuilderProvider) {

  schemaFormDecoratorsProvider.defineAddOn(
    'bootstrapDecorator',           // Name of the decorator you want to add to.
    'cloudinaryfileupload',                      // Form type that should render this add-on
    'src/templates/asf-cloudinary-file-upload.html',  // Template name in $templateCache
    sfBuilderProvider.stdBuilders   // List of builder functions to apply.
  );
});

cloudinaryFileUploadModule.controller('cloudinaryFileUploadCtrl', CloudinaryFileUploadCtrl);

CloudinaryFileUploadCtrl.$inject = ['$scope', 'Upload','cloudinary'];

  function CloudinaryFileUploadCtrl ($scope,  $upload, cloudinary) {
    var d = new Date();
    $scope.title = "Image (" + d.getDate() + " - " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ")";
    $scope.model.title = $scope.title;
    cloudinary.config().cloud_name= $scope.form.cloudName;
    cloudinary.config().upload_preset = $scope.form.uploadPreset;

    $scope.uploadFiles = function(files){
      $scope.files = files;
      if (!$scope.files) return;
      angular.forEach(files, function(file){
        if (file && !file.$error) {
          file.upload = $upload.upload({
            url: "https://api.cloudinary.com/v1_1/" + cloudinary.config().cloud_name + "/upload",
            data: {
              upload_preset: cloudinary.config().upload_preset,
              tags: 'myphotoalbum',
              context: 'photo=' + $scope.title,
              file: file
            }
          }).progress(function (e) {
            file.progress = Math.round((e.loaded * 100.0) / e.total);
            file.status = "Uploading... " + file.progress + "%";
          }).success(function (data, status, headers, config) {
            $scope.photos = $scope.photos || [];
            data.context = {custom: {photo: $scope.title}};
            file.result = data;
            $scope.model.image = data;
            $scope.photos.push(data);
          }).error(function (data, status, headers, config) {
            file.result = data;
          });
        }
      });
    };
}

})();