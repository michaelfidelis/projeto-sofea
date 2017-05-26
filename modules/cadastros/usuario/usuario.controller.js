(function () {
	'use strict';
	angular.module('projetosofea.cadastros')
		.controller('UsuarioController', UsuarioController);

	UsuarioController.$inject = ['UsuarioService', '$state'];

	function UsuarioController(UsuarioService, $state) {
		var self = this;
		self.usuarios = [];
		self.listarUsuarios = listarUsuarios;
		self.adicionarUsuario = adicionarUsuario;
		self.removerUsuario = removerUsuario;

		function listarUsuarios() {
			UsuarioService.query().$promise.then(isSuccess, isError);

			function isSuccess(response) {
				console.log('Usuarios: '+ JSON.stringify(response), response);
				self.usuarios = response;
			}

			function isError(response) {
				console.error('Erro ao obter Usuarios.', response);
				self.usuarios = [];
			}
		};

		listarUsuarios();

		function adicionarUsuario() {
			UsuarioService.save(angular.copy(self.usuario))
				.$promise.then(isSuccess, isError);

			function isSuccess(response) {
				console.log('Usuário cadastrado com sucesso!');
				self.usuarios = self.listarUsuarios();
				self.usuario = {};
				$state.go('listarUsuarios');
			}

			function isError(response) {
				console.error('Erro ao salvar Usuario.', response);
			}
		};


		function removerUsuario(usuario, index) {
			self.usuarios.splice(index, 1);
			self.usuarios = angular.copy(self.usuarios);
			UsuarioService.remove({
				codigo: usuario.codigo
			}).$promise.then(isSuccess, isError);

			function isSuccess(response) {
				console.log('Usuário removido com sucesso!', response);
			}

			function isError(response) {
				console.error('Erro ao remover Usuario.', response);
			}
		};



	};

})();
