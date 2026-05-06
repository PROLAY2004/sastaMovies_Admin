const formatDate = (dateString) => {
	if (!dateString) return 'N/A';
	const options = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	};
	return new Date(dateString).toLocaleDateString('en-US', options);
};

export default formatDate;
