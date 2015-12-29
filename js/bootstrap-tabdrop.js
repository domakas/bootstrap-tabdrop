/* =========================================================
 * bootstrap-tabdrop.js angular edition
 * https://github.com/domakas/bootstrap-tabdrop
 * =========================================================
 * Copyright 2012 Stefan Petre
 * Copyright 2013 Jenna Schabdach
 * Copyright 2014 Jose Ant. Aranda
 * Copyright 2015 Domas Maksimas
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

!function (angular) {

	var app = angular.module('bootstrap.tabdrop', []);

	app.directive('tabdrop', ['$parse', 'TabDrop', function($parse, TabDrop) {
		var defaults = {
			text: '<i class="fa fa-align-justify"></i>',
			offsetTop: 0
		};

		return {
			link: linkFunction
		};

		function linkFunction(scope, element, attr) {
      var data = element.data('tabdrop');
			var option = $parse(attr.tabdrop)(scope);
      var options = typeof option === 'object' && option;

			if (!data) {
				options = angular.extend({}, defaults, options);
				data = new TabDrop(element, options);
				element.data('tabdrop', data);
			}
			if (typeof option == 'string') {
				data[option]();
			}

      scope.$on('$destroy', data.teardown);
		}
	}]);

  app.factory('TabdropWinResizer', ['$window', '$timeout', function($window, $timeout) {
    var registered = [];
    var inited = false;
    var timer;

    function resize() {
      $timeout.cancel(timer);
      timer = $timeout(notify, 100);
    }

    function notify() {
      for (var i = 0, cnt = registered.length; i < cnt; i++) {
        registered[i].apply();
      }
    }

    function register(fn) {
      registered.push(fn);
      if (inited === false) {
        angular.element($window).bind('resize', resize);
        inited = true;
      }
    }

    function unregister(fn) {
      var registeredFnIndex = registered.indexOf(fn);
      if (registeredFnIndex > -1) {
        registered.splice(registeredFnIndex, 1);
      }
    }

    return {
      register: register,
      unregister: unregister
    }
  }]);

  app.factory('TabDrop', ['$compile', '$timeout', 'TabdropWinResizer', function($compile, $timeout, TabdropWinResizer) {

    TabDrop.prototype = {
      constructor: TabDrop,

      layout: function () {
        var self = this;
        var collection = [];
        var isUsingFlexbox = function(el){
          return el.element.css('display').indexOf('flex') > -1;
        };

        function setDropdownText(text) {
          self.dropdown.find('a span.display-tab').html(text);
        }

        function setDropdownDefaultText(collection) {
          var text;
          if (angular.isFunction(self.options.text)) {
            text = self.options.text(collection);
          } else {
            text = self.options.text;
          }
          setDropdownText(text);
        }

        // Flexbox support
        function handleFlexbox(){
          if (isUsingFlexbox(self)){
            if (self.element.find('li.tabdrop').hasClass('pull-right')){
              self.element.find('li.tabdrop').css({position: 'absolute', right: 0});
              self.element.css('padding-right', self.element.find('.tabdrop').outerWidth(true));
            }
          }
        }

        function checkOffsetAndPush(recursion) {
          self.element.find('> li:not(.tabdrop)')
            .each(function () {
              if (this.offsetTop > self.options.offsetTop) {
                collection.push(this);
              }
            });

          if (collection.length > 0) {
            if (!recursion) {
              self.dropdown.removeClass('hide');
              self.dropdown.find('ul').empty();
            }
            self.dropdown.find('ul').prepend(collection);

            if (self.dropdown.find('.active').length == 1) {
              self.dropdown.addClass('active');
              setDropdownText(self.dropdown.find('.active > a').html());
            } else {
              self.dropdown.removeClass('active');
              setDropdownDefaultText(collection);
            }
            handleFlexbox();
            collection = [];
            checkOffsetAndPush(true);
          } else {
            if (!recursion) {
              self.dropdown.addClass('hide');
            }
          }
        }

        self.element.append(self.dropdown.find('li'));
        checkOffsetAndPush();
      }
    };

    return TabDrop;

    function TabDrop(element, options) {
      this.element = element;
      this.options = options;

      if (options.align === 'left') {
        this.dropdown = $('<li class="dropdown hide pull-left tabdrop" dropdown><a class="dropdown-toggle" dropdown-toggle href="#"></a><ul class="dropdown-menu"></ul></li>');
      } else {
        this.dropdown = $('<li class="dropdown hide pull-right tabdrop" dropdown><a class="dropdown-toggle" dropdown-toggle href="#"></a><ul class="dropdown-menu"></ul></li>');
      }

      $compile(this.dropdown)(this.element.scope());
      this.dropdown.prependTo(this.element);
      if (this.element.parent().is('.tabs-below')) {
        this.dropdown.addClass('dropup');
      }

      var boundLayout = angular.element.proxy(this.layout, this);

      TabdropWinResizer.register(boundLayout);
      $timeout(boundLayout, 300);
      this.element.on('click', 'li:not(.tabdrop)', boundLayout);

      this.teardown = function () {
        TabdropWinResizer.unregister(boundLayout);
        element.off('click', 'li:not(.tabdrop)', boundLayout);
      };

      this.layout();
    }
  }]);

}(window.angular);
