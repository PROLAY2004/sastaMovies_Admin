const customStyles = {
	control: (base) => ({
		...base,
		backgroundColor: '#0a0a0a',
		borderColor: '#222',
		color: '#fff',
		boxShadow: 'none',
		'&:hover': { borderColor: '#4c6613' },
	}),
	menu: (base) => ({
		...base,
		backgroundColor: '#141414',
	}),
	multiValue: (base) => ({
		...base,
		backgroundColor: '#9ee600',
		color: '#000',
	}),
	multiValueLabel: (base) => ({
		...base,
		color: '#000',
	}),
	option: (base, state) => ({
		...base,
		backgroundColor: state.isFocused ? '#4c6613' : '#141414',
		color: '#fff',
		cursor: 'pointer',
	}),
	singleValue: (base) => ({
		...base,
		color: '#fff',
	}),
};

export default customStyles;
