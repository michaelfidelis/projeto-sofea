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
            self.data = self.data || [];
            self.tableBody = $element.find('TBODY');
            console.log('Data: ', self.data);

            self.adicionarColuna = function (coluna) {
                var colunaData = {
                    titulo: coluna.attributes.titulo.value,
                    atributos: coluna.attributes,
                    elemento: coluna
                };
                self.colunas.push(colunaData);

                var novaColuna = angular.element('<td></td>');

                var tableRows = self.tableBody.find('TR') || [];
                console.log('TableRows: ', tableRows);
                angular.forEach(tableRows, function(tableRow){
                    tableRow.cells.push(angular.element('<td></td>'));
                });
                coluna.remove();

            }

            self.adicionarLinhas = function () {
                console.log('Adicionando linhas...');
                var index = 0;
                self.data.forEach(function (registro) {
                    var tableRow = angular.element('<tr>{{usuario.nome}}</tr>')
                    tableRow.addClass('psgrid-row jsgrid-row');
                    tableRow.attr('ng-class-odd', 'jsgrid-row');
                    tableRow.attr('ng-class-even', 'jsgrid-alt-row');
                    tableRow[self.variavel] = registro;
                    tableRow.$index = index++;
                    self.tableBody.append(tableRow);
                })
            }

            self.adicionarLinhas();
        }

    }
})();
