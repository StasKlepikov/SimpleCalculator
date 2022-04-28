class Calculator {
	functionNames = ['cos', 'sin', 'tan', 'asin', 'acos', 'sqrt'];

	/**
	 * 
	 * @param {Element} container 
	 */
	constructor(container) {
		this.history = [];

		this.container = container;
		this.expressionInput = container.querySelector('.expression_input');
		this.expressionResult = container.querySelector('.expression_output');
		this.calculateButton = container.querySelector('.expression_calculate_button');
		this.functionsButton = container.querySelector('.functions_button');
		this.buttonContainer = container.querySelector('.button_container');

		this.showFunctions = false;

		this.createButtons();

		this.functionsButton.addEventListener('click', () => {
			this.showFunctions = !this.showFunctions;
			this.functionsButton.textContent = this.showFunctions ? 'Hide functions' : 'Show functions';
			this.createButtons();
		})

		this.calculateButton.addEventListener('click', () => {
			try {
				const result = eval(this.expressionInput.value);

				this.expressionResult.value = result;
				this.expressionInput.focus();
			} catch (e) {
				this.expressionResult.value = 'Error';
			}
		});
	}

	createButtons() {
		this.buttonContainer.innerHTML = '';

		const click = (str) => {
			if (this.functionNames.includes(str.slice(0, -2))) str = `Math.${str}`;
			if (document.activeElement != this.expressionInput) this.expressionInput.focus();
			console.log(str);
	
			let cursor = this.expressionInput.selectionStart;

			const text = this.expressionInput.value.split('');
			text.splice(cursor, 0, str);

			cursor += str.length - (str.endsWith(')')? 1 : 0);

			this.expressionInput.value = text.join('');
			this.expressionInput.selectionStart = cursor;
			this.expressionInput.selectionEnd = cursor;
		}

		const layout = [
			[],
			[7, 8, 9],
			[4, 5, 6],
			[1, 2, 3],
			['.', 0, '(', ')'],
		]

		const buttons = [];

		const operators = ['+', '-', '*', '/']
		for (let ot in operators) {
			const row = Math.floor(ot/4);

			if (!layout[row]) layout[row] = [];
			layout[row].unshift(operators[ot]);
		}

		
		if (this.showFunctions) {
			const row = [[]];
			let rowN = 0
			for(let btn of this.functionNames) {
				if (row[rowN].length >= 4) {
					rowN++; row[rowN] = [];
				}
				row[rowN].push(`${btn}()`);
			}
			layout.unshift(...row);
		}

		for (let row of layout) {
			for (let btn of row) {
				const el = document.createElement('input');
				el.type = 'button';
				el.value = btn;

				el.addEventListener('click', (e) => {
					e.preventDefault()
					click(el.value)
				});

				buttons.push(el);
			}
			buttons.push(document.createElement('br'));
		}

		this.buttonContainer.append(...buttons);
	}
}

const calculator = new Calculator(document.getElementById('calculator_container'));
