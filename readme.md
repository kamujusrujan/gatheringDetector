Detects number of people using Audio

Dataset used Libra MultiSpeaker dataset


validation accuracy is over 40%. Converted audio to spectrogram with 512 fft length and used CNN network to detect spikes in spectrogram.

Problems to solve : 
	1. tf data microphone library outputs and spicy spectrogram scaled output validation
	2. Scaling input data. Presently using tf norm layer to normalize 
	3. 
