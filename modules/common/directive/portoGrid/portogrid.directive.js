(function () {
    'use strict';

    angular.module('projetosofea.common.directive')
        .directive('portoGrid', PortoGridDirective);

    PortoGridDirective.$inject = [];

    function PortoGridDirective() {
        return {
            templateUrl: "modules/common/directive/portoGrid/portogrid.template.html",
            transclude: true,
            restrict: 'E',
            bindToController: true,
            controller: PortoGridController,
            controllerAs: 'grid',
            link: PortoGridLink,
            scope: {
                data: '=',
                variavel: '@?',
                itemSelecionado: '=?',
                acaoPaginacao: '&?',
                acaoSelecionar: '&?',
                pagina: '=?',
                totalRegistros: '=?',
                tamanhoPagina: '=?',
                mostrarPaginacao: '=?'
            }
        }

        PortoGridController.$inject = ['$scope', '$element', '$attrs'];

        function PortoGridController($scope, $element, $attrs) {
            var self = this;
            self.colunas = [];

            self.adicionarColuna = function (coluna) {
                var colunaExistente = self.colunas.some(function (item) {
                    return item.titulo === coluna.attributes.titulo.value;
                });

                console.log('Coluna adicionada: ' + coluna.attributes.titulo.value);
                var colunaData = {
                    titulo: coluna.attributes.titulo.value,
                    atributos: coluna.attributes,
                    elemento: coluna
                };
                self.colunas.push(colunaData);
                self.adicionaTag(colunaData.elemento);
                coluna.remove();
            }

            self.adicionaTag = function (coluna) {

                var tableBody = $element.find('TBODY');
                var tableRow = tableBody.find('TR');

                var tableColumn = angular.element('<td></td>')
                tableColumn.append(coluna.innerHTML);
                tableRow.append(tableColumn);
            }

        }

        PortoGridLink.$inject = ['scope', 'element', 'attrs', 'controller'];

        function PortoGridLink(scope, element, attrs, controller) {

        }
    }
})();
