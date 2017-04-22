declare var SocketIOCustom : {
    connect(url: string): CustomSocketType;
}
interface CustomSocketType {
    on(event: string, callback: (data: any) => void );
    once(event: string, callback: (data: any) => void );
    emit(event: string, data: any);
    disconnect: () => void;
}