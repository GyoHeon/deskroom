const Avatar: React.FC<{ name: string }> = ({name}) => {
    const avatar = name.split('@')[0].at(0).toUpperCase();
    const avatarColor = `#${name.split('').reduce((acc, char) => {
        const charCode = char.charCodeAt(0);
        return acc + charCode;
    }, 0).toString(16).slice(-6)}`;
    return (
        <div className="flex justify-center items-start py-4 px-2">
            <div className="flex justify-center items-center rounded-md bg-gray-100 h-10 w-10"
                 style={{backgroundColor: avatarColor}}>
                <span className="text-gray-500 font-bold text-lg">{avatar}</span>
            </div>
        </div>
    )
};
export default Avatar