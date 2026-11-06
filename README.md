comecei por tentar buscar a camera como imput, no entanto a camera não respondia,
pedi ajuda ao copilot e expliquei qual era o objetivo 
    - detectar os movimentos da minha mão para desenhar como pinça no espaço 
pedido e feito, no entanto o codigo gerado possuia algumas ``falhas`` quais tive de corrigir
    - a imagem estava espelhada e gerava confusão
    - a imagem estava muito pequena
    - a sensibilidade da pinça estava muito descalibrada
    - as teclas de brush size não estavam funcionando
comecei por ajustar o espelhar da tela recorrendo a IA novamente,
tentei ajustar manualmente o tamanho da imagem, no entanto o esticar da imagem para preencher a pagina por completo esticava ligeramente a imagem causando desregulagem na pinça, então aumentei manualmente contruindo uma proporção qual julgava menos prejudicial para a captação do gesto.
a sensibilidade ajustei manualmente alterando os valores das constantes presentes nas linhas 20 e 21 do .js
recorri ao codigo feito no exercicio ``if/else`` para incluir o color picker e auxilirar nos ajustes ao brush size
ajustei o brush size e atribui a variavel na ponta do cursor da pinça, gerando uma pre-visualização do tamnaho atual do brush antes de desenhar.