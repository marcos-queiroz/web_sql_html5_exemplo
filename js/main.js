
function openPagina(pagina) {
	$.ajax({
		url: pagina,
		type: 'GET',
		dataType: 'html'
	})
	.done(function() {
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function(data) {
		console.log("complete");
		$('#divDinamica').html(data);
	});
	
};

function salvarCliente() {
    // Dados do cliente a ser cadastrado...
    var registro = {
            "NOME": $("#nome").val(),
            "IDADE": $("#idade").val(),
            "SEXO": $("#sexo").val(),    
            "TELEFONE": $("#telefone").val(),
            "EMAIL": $("#email").val(),                
    };

    if($("#codigo").val() != ""){
    	// Atualizar cliente...
	    mydb.update("cliente", registro, "CODIGO", $("#codigo").val(), function(result){         
	       // Mensagem de sucesso!
	       if(result){
	        	alert("Cliente: Atualizado com sucesso!");
	       }else{
	       		alert("Cliente: Não foi Atualizado!");
	       }
	    });
    }else{
	    // Cadastrar cliente...
	    mydb.insert("cliente", registro, function(codigo){         
	       	// Mensagem de sucesso!
	        alert("Cliente #"+ codigo +" cadastrado com sucesso!");    		
	    });
    }
    openRealatorio(); 
};

function editarCliente(codigo) {
    openPagina('cadastrar.html');
	
	// Montar SQL pra buscar dados do cliente no banco de dados..
    var sql = "select * from cliente where CODIGO="+ codigo;

    // Buscando os dados na tabela...
    mydb.query(sql,function(registros){
        
        // Validar registro do cliente...
        if(registros.rows.length>0){

            // Capturando dados retornado...
            var cliente = registros.rows.item(0);
            
            $("#codigo").val(cliente.CODIGO);
            $("#nome").val(cliente.NOME);
            $("#idade").val(cliente.IDADE);
            $("#sexo").val(cliente.SEXO);
            $("#telefone").val(cliente.TELEFONE);
            $("#email").val(cliente.EMAIL);  
            
        }else{
            alert("Nenhum registro encontrado.");
        }
        
    });
}

function deletarCliente(codigo){
	var CODIGO = codigo;
	// Deletar cliente...
    mydb.delete("cliente", "CODIGO", CODIGO, function(result){         
       	// Mensagem de sucesso!
       	if(result){
        	alert("Cliente Deletado com sucesso!");
       	}else{
       		alert("Cliente não foi Deletado!");
       	}
    });
    
    openRealatorio();
}


function openRealatorio(){
    openPagina('relatorio.html');
	
	// Selecionar todos os registros de clientes...
    mydb.selectAll("cliente", function(registros){
        // Limpar relatório (listaRelatorio)...
        $("#listaRelatorio").empty();
        
        // Percorrer CADA registro encontrado...
        $.each(registros, function(c, cliente){
            
            // Montar linha do relatório (item)...
            var item = '<tr>'+
            				'<td>'+ cliente.CODIGO +'</td>'+
            				'<td>'+ cliente.NOME +'</td>'+
            				'<td>'+ cliente.IDADE +'</td>'+
            				'<td class="btn-group">'+
            					'<button onclick="editarCliente('+ cliente.CODIGO +')" type="button" class="btn btn-sm btn-warning">Editar</button>'+
            					'<button onclick="deletarCliente('+ cliente.CODIGO +')" type="button" class="btn btn-sm btn-danger">Deletar</button>'+
            				'</td>'+
            			'</tr>';
            
            // Adicionar item ao relatório (listaRelatorio)...
            $("#listaRelatorio").prepend(item);
        });       
    });
    return false; 
};

function resetBD(){
	mydb.resetDatabase();

	alert("Banco RESETADO");

	mydb.initialize(function(status){
        // Caso não se conecte...
        if(status == false){
            console.log("Não foi possível se conectar ao BD.");
        }else{
        	console.log("Conectado ao BD.");
        }
    });

    openRealatorio();
}
