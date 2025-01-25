import HoldOn from 'react-hold-on';

var options = {
  theme: 'sk-dot',
  message: 'Please Wait...',
  backgroundColor: '#1847B1',
  textColor: 'red',
};

export const showLoader = () => {
  HoldOn.open(options);
};

export const hideLoader = () => {
  HoldOn.close();
};
