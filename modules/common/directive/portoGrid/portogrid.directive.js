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

		PortoGridController.$inject = ['$scope', '$element', '$compile', '$sce'];

		function PortoGridController($scope, $element, $compile, $sce) {
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

				var novaColuna = '<td>' + coluna.innerHTML + '</td>';
				var tableRows = self.tableBody.find('TR') || [];
				console.log('TableRows: ', tableRows);
				angular.forEach(tableRows, function (tableRow) {
					tableRow.innerHTML += novaColuna;
					$compile(tableRow)(tableRow);
				});
				coluna.remove();
			};

			self.adicionarLinhas = function () {
				console.log('Adicionando linhas...');
				var index = 0;
				self.data.forEach(function (registro) {
					var tableRow = angular.element('<tr>{{usuario.nome}}</tr>');
					tableRow.addClass('psgrid-row jsgrid-row');
					tableRow.attr('ng-class-odd', 'jsgrid-row');
					tableRow.attr('ng-class-even', 'jsgrid-alt-row');

					//tableRow.attr('ng-init', self.variavel + ' = ' + JSON.stringify(registro));
					//tableRow[0][self.variavel] = registro;
					tableRow.$index = index++;
					var scope = $scope.$new();
					scope[self.variavel] = registro;
					var batata = $compile(tableRow);
					var finalHTML = batata(scope);
					self.tableBody.append(finalHTML);
				});
			};

			self.adicionarLinhas();
		}

	}
})();
