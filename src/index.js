import DateInput from './DateInput.vue';
import './styles/date-input.scss';

DateInput.install = (app) => {
  app.component('DateInput', DateInput);
};

export { DateInput };
export default DateInput;
