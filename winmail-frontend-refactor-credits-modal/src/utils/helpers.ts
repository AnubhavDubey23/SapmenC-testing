export function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export function formatDate(date: string) {
  const today = new Date();
  const formattedDate = new Date(date);
  let finalDate = '';

  if (today.getDate() === formattedDate.getDate()) {
    if (formattedDate.getHours() > 11) {
      return `${formattedDate.getHours()}:${formattedDate.getMinutes()} pm`;
    }
    return `${formattedDate.getHours()}:${formattedDate.getMinutes()} am`;
  }

  if (formattedDate.getDate() <= 9) {
    finalDate += `0${formattedDate.getDate()}`;
  } else {
    finalDate += `${formattedDate.getDate()}`;
  }

  if (formattedDate.getMonth() <= 9) {
    finalDate += `/0${formattedDate.getMonth() + 1}`;
  } else {
    finalDate += `/${formattedDate.getMonth() + 1}`;
  }

  finalDate += `/${formattedDate.getFullYear()}`;

  return finalDate;
}

export const generateNewTemplateName = (currentName: string) => {
  const copyRegex = /^(.*?)(?: Copy (\d+))?$/;
  const match = currentName.match(copyRegex);

  if (match && match[2]) {
    // If "Copy <NUMBER>" exists, increment the number
    const baseName = match[1];
    const number = parseInt(match[2], 10) + 1;
    return `${baseName} Copy ${number}`;
  } else {
    // If no "Copy <NUMBER>" exists, add "Copy 1"
    return `${currentName} Copy 1`;
  }
};

export const getAuthenticatedHeaderObject = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
