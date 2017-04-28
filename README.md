Angular Schema Form Cloudinary File Upload add-on by Saif Jerbi
=================

This file upload add-on uses the official [Cloudinary](https://cloudinary.com) client library for AngularJS to provide a file upload interface.

[![bower version](https://img.shields.io/bower/v/angular-schema-form.svg?style=flat-square)](#bower)
[![npm version](https://img.shields.io/npm/v/angular-schema-form.svg?style=flat-square)](https://www.npmjs.org/package/angular-schema-form)
[![npm downloads](https://img.shields.io/npm/dm/angular-schema-form.svg?style=flat-square)](http://npm-stat.com/charts.html?package=angular-schema-form&from=2015-01-01)

Installation
------------
To use it, just include:
```HTML
    <!-- angular file upload -->
    <script src="../bower_components/ng-file-upload/ng-file-upload-shim.js"></script>
    <!-- cloudinary angular plugin -->
    <script src="../bower_components/cloudinary_ng/js/angular.cloudinary.js"></script>
    <!-- angular file upload -->
    <script src="../bower_components/ng-file-upload/ng-file-upload.js"></script>

    <script src="../dist/asf-cloudinary-file-upload.js"></script>
```
Be sure to load this projects files after you load angular schema form

Usage
------------

The asf-cloudinary-file-upload add-on adds a new form type, `cloudinaryfileupload`

|  Form Type               |   Becomes            |
|:-------------------------|:--------------------:|
|  cloudinaryfileupload    |  A cloudinary file upload component |

Options 
------------

The `cloudinaryfileupload` field takes two options.

|  Form Type    |   Becomes                   |
|:--------------|:---------------------------:|
|  cloudName    |  [Cloudinary configuration](http://cloudinary.com/documentation/upload_images) |
|  uploadPreset |  [Cloudinary configuration](http://cloudinary.com/documentation/upload_images) |

You can refer to [Cloudinary Admin Configuration](http://cloudinary.com/documentation/admin_api) for more details.

Example
------------

```javascript
angular.module('test', ["schemaForm","cloudinaryFileUpload"]).controller('FormController', function($scope) {

        $scope.schema = {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "title": "Cloudinar File Upload",
              "description": "Testing cloudinary file upload ASF addon",
            }
          }
        }

        $scope.form = [
            {"label":"Thumbnail",
            "type":"cloudinaryfileupload",
            "key":"thumbnailPath",
            "cloudName":"YOUR_CLOUDINARY_NAME",
            "uploadPreset":"YOUR_UPLOAD_PRESET"}]
        $scope.model = {};
      });

```
