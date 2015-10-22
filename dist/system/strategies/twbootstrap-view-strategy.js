System.register(['../validation-view-strategy', 'aurelia-logging'], function (_export) {
  'use strict';

  var ValidationViewStrategy, TheLogManager, TWBootstrapViewStrategyBase, TWBootstrapViewStrategy;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  return {
    setters: [function (_validationViewStrategy) {
      ValidationViewStrategy = _validationViewStrategy.ValidationViewStrategy;
    }, function (_aureliaLogging) {
      TheLogManager = _aureliaLogging;
    }],
    execute: function () {
      TWBootstrapViewStrategyBase = (function (_ValidationViewStrategy) {
        _inherits(TWBootstrapViewStrategyBase, _ValidationViewStrategy);

        function TWBootstrapViewStrategyBase(appendMessageToInput, appendMessageToLabel, helpBlockClass) {
          var formGroupClass = arguments.length <= 3 || arguments[3] === undefined ? "form-group" : arguments[3];
          var validationMsgTagName = arguments.length <= 4 || arguments[4] === undefined ? "p" : arguments[4];

          _classCallCheck(this, TWBootstrapViewStrategyBase);

          _ValidationViewStrategy.call(this);
          this.appendMessageToInput = appendMessageToInput;
          this.appendMessageToLabel = appendMessageToLabel;
          this.helpBlockClass = helpBlockClass;
          this.formGroupClass = formGroupClass;
          this.validationMsgTagName = validationMsgTagName;
          this.logger = TheLogManager.getLogger('validation');
        }

        TWBootstrapViewStrategyBase.prototype.searchFormGroup = function searchFormGroup(currentElement, currentDepth) {
          if (currentDepth === 5 || !currentElement) {
            return null;
          }

          if (currentElement.classList && currentElement.classList.contains(this.formGroupClass)) {
            return currentElement;
          }

          return this.searchFormGroup(currentElement.parentNode, 1 + currentDepth);
        };

        TWBootstrapViewStrategyBase.prototype.findLabels = function findLabels(formGroup, inputId) {
          var labels = [];
          this.findLabelsRecursively(formGroup, inputId, labels, 0);
          return labels;
        };

        TWBootstrapViewStrategyBase.prototype.findLabelsRecursively = function findLabelsRecursively(currentElement, inputId, currentLabels, currentDepth) {
          if (currentDepth === 5) {
            return;
          }
          if (currentElement.nodeName === 'LABEL' && (currentElement.attributes['for'] && currentElement.attributes['for'].value === inputId || !currentElement.attributes['for'])) {
            currentLabels.push(currentElement);
          }
          for (var i = 0; i < currentElement.children.length; i++) {
            this.findLabelsRecursively(currentElement.children[i], inputId, currentLabels, 1 + currentDepth);
          }
        };

        TWBootstrapViewStrategyBase.prototype.appendMessageToElement = function appendMessageToElement(element, validationProperty) {
          var helpBlock = this.findExistingHelpBlock(element);

          if (!helpBlock) {
            helpBlock = document.createElement(this.validationMsgTagName);
            helpBlock.classList.add('help-block');
            helpBlock.classList.add(this.helpBlockClass);
            this.addHelpBlockToElement(element, helpBlock);
          }

          helpBlock.textContent = validationProperty ? validationProperty.message : '';
        };

        TWBootstrapViewStrategyBase.prototype.findExistingHelpBlock = function findExistingHelpBlock(element) {
          var helpBlock = element.nextSibling;
          if (helpBlock) {
            if (!helpBlock.classList) {
              return null;
            } else if (!helpBlock.classList.contains(this.helpBlockClass)) {
              return null;
            }
          }
          return helpBlock;
        };

        TWBootstrapViewStrategyBase.prototype.addHelpBlockToElement = function addHelpBlockToElement(element, helpBlock) {
          if (element.nextSibling) {
            element.parentNode.insertBefore(helpBlock, element.nextSibling);
          } else {
            element.parentNode.appendChild(helpBlock);
          }
        };

        TWBootstrapViewStrategyBase.prototype.appendUIVisuals = function appendUIVisuals(validationProperty, currentElement) {
          var formGroup = this.searchFormGroup(currentElement, 0);
          if (formGroup === null) {
            this.logger.warn("Didn't find formGroup - can't show validation message for element:", currentElement);
            return;
          }

          if (validationProperty && validationProperty.isDirty) {
            if (validationProperty.isValid) {
              formGroup.classList.remove('has-warning');
              formGroup.classList.add('has-success');
            } else {
              formGroup.classList.remove('has-success');
              formGroup.classList.add('has-warning');
            }
          } else {
            formGroup.classList.remove('has-warning');
            formGroup.classList.remove('has-success');
          }

          if (this.appendMessageToInput) {
            this.appendMessageToElement(currentElement, validationProperty);
          }

          if (this.appendMessageToLabel) {
            var labels = this.findLabels(formGroup, currentElement.id);
            for (var ii = 0; ii < labels.length; ii++) {
              var label = labels[ii];
              this.appendMessageToElement(label, validationProperty);
            }
          }
        };

        TWBootstrapViewStrategyBase.prototype.prepareElement = function prepareElement(validationProperty, element) {
          this.appendUIVisuals(null, element);
        };

        TWBootstrapViewStrategyBase.prototype.updateElement = function updateElement(validationProperty, element) {
          this.appendUIVisuals(validationProperty, element);
        };

        return TWBootstrapViewStrategyBase;
      })(ValidationViewStrategy);

      _export('TWBootstrapViewStrategyBase', TWBootstrapViewStrategyBase);

      TWBootstrapViewStrategy = function TWBootstrapViewStrategy() {
        _classCallCheck(this, TWBootstrapViewStrategy);
      };

      _export('TWBootstrapViewStrategy', TWBootstrapViewStrategy);

      TWBootstrapViewStrategy.AppendToInput = new TWBootstrapViewStrategyBase(true, false, 'aurelia-validation-message');
      TWBootstrapViewStrategy.AppendToMessage = new TWBootstrapViewStrategyBase(false, true, 'aurelia-validation-message');
    }
  };
});