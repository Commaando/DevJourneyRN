export const fetchDummyData = async (): Promise<{message: string}> => {
    //Simulate api 
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({message: "Welcome to Dev Journey"})
        }, 1000);
    })
}