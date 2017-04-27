angular.module('templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('src/templates/asf-cloudinary-file-upload.html','<div>\n<!-- Surrounding DIV for sfField builder to add a sfField directive to. -->\n\n  <div id="direct_upload" \n    ngf-drop="uploadFiles($files)"\n    ngf-drag-over-class="dragOverClass($event)"\n    ng-model="files"\n    ng-multiple="true" ng-controller="cloudinaryFileUploadCtrl">\n    <form>\n        <div class="form_line">\n            <label path="title">Title:</label>\n            <div class="form_controls">\n                <input type="text" class="form-control" placeholder="Title" ng-model="title" />\n            </div>\n        </div>\n        <div class="form_line">\n            <label>{{form.label}}:</label>\n            <div class="form_controls">\n                <div class="upload_button_holder">\n                    <div href="#" class="upload_button" ngf-select="uploadFiles($files)" title="upload" resetOnClick="true" >Upload</div>\n                </div>\n            </div>\n        </div>\n    </form>\n    <h2>Status</h2>\n    <div class="file" ng-repeat="file in files">\n        <h3>{{file.name}} {{f.$error}} {{f.$errorParam}}</h3>\n        <div class="status">{{file.status}}</div>\n        <div class="progress-bar">\n          <div class="progress" style="width: {{file.progress}}%" ng-init="progress=0"></div>\n        </div>\n        <div class="form_line">\n            <div class="form_controls">\n                <div class="preview">\n                    <img ngf-src="file.result.url || file" style="width: 150px;">\n                </div>\n            </div>\n        </div>\n        <div class="info">\n          <table>\n            <tr ng-repeat="(key, value) in file.result">\n              <td> {{key}} </td> <td> {{ value }} </td>\n            </tr>\n          </table>\n        </div>\n    </div>\n    \n</div>\n  <!-- sf-field-model let\'s the ngModel builder know that you want a ng-model that matches against the form key here -->\n  <!-- schema-validate="form" validates the form against the schema -->\n\n  <span sf-message="form.description"></span>\n  <!-- Description & Validation messages -->\n\n</div>\n');}]);
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

cloudinaryFileUploadModule.controller('cloudinaryFileUploadCtrl', ['$scope', 'Upload','cloudinary',
  function ($scope,  $upload, cloudinary) {
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
}]);