angular.module('templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('src/templates/asf-cloudinary-file-upload.html','<div>\n<!-- Surrounding DIV for sfField builder to add a sfField directive to. -->\n\n  <div id="direct_upload" \n    ngf-drop="uploadFiles($files)"\n    ngf-drag-over-class="dragOverClass($event)"\n    ng-model="files"\n    ng-multiple="true" ng-controller="cloudinaryFileUploadCtrl">\n      <div class="setting image_picker">\n        <h2>{{form.label}}:</h2>\n        <div class="settings_wrap">\n          <label class="drop_target" ngf-select="uploadFiles($files)" resetOnClick="true">\n          </label>\n          <div class="settings_actions vertical" ng-repeat="file in files" ng-class="{\'upload-success\': file.result.success, \'upload-error\': file.result.failed==true}">\n            <a data-action="choose_from_uploaded">\n            <i class="fa fa-picture-o"></i>  {{file.name}} </a>\n            <a class="disabled" data-action="remove_current_image">  \n              <i class = "fa" ng-class="{\'fa-retweet\': !file.result.success && !file.result.error, \'fa-check-circle\': file.result.success, \'fa-meh-o\': file.result.failed}"></i> \n              {{file.status}}\n            </a>\n            <div class="progress"> \n              <div class="progress-bar" role="progressbar" style="width: {{file.progress}}%" ng-init="file.progress=0"></div>\n            </div>\n          </div>\n        </div>\n    </div>\n  </div>\n</div>');}]);
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
            data: {
              upload_preset: cloudinary.config().upload_preset,
              tags: 'myphotoalbum',
              file: file
            }
          }).progress(function (e) {
            file.progress = Math.round((e.loaded * 100.0) / e.total);
            file.status = "Uploading... " + file.progress + "%";
          }).success(function (data, status, headers, config) {
            $scope.photos = $scope.photos || [];
            file.result = data;
            file.result.success= true;
            $scope.model.image = data;
            $scope.photos.push(data);
            file.status = "Uploaded";
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