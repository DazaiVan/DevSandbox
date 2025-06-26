

export function notifitaction(flag:boolean){
    const notification =document.createElement('div');
    notification.className = 'notification';
    notification.textContent = flag === true?'Поставьте маркер в нужное место на модели':'Сначала загрузите модель';
    document.getElementById("root")?.appendChild(notification)
    notification.classList.add('slide-in');

    setTimeout(() => {
        notification.classList.remove('slide-in');
        notification.classList.add('slide-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

