import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ImExit } from "react-icons/im";
import { BsPersonBoundingBox } from "react-icons/bs"
import "./DropDownMenu.css";
import ProfileImage from "../../assets/images/ProfileImage.jpg"

interface DropdownMenuProps {
    onLogout: () => void;
    onAccountDetails: () => void;
}

interface IUser {
    ID: string;
    creation_date: Date;
    expiration_date: Date;
    name: string;
    lastName: string;
    email: string;
    account_status: string;
    telegram_user_name: string;
  }

interface Image {
    _id: string;
    userId: string;
    name: string;
    data: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ onLogout, onAccountDetails }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [userId, setUserId] = useState<string>('user123');
    const [image, setImage] = useState<Image | undefined>();
    const getUserById = async (userId: any): Promise<IUser | null> => {
        try {
          const response = await axios.get(`http://localhost:3003/api/getUserById/eaf34089-5734-4c5b-a175-40cb11e21f43`);
          return response.data;
        } catch (error) {
          console.error('Error fetching user by ID:', error);
          return null;
        }
      };
    
      const fetchUser = async () => {
        const fetchedUser = await getUserById(userId);
        if (fetchedUser) {
          setUser(fetchedUser);
        }
      };
    
    
      useEffect(() => {
        fetchUser();
      }, [userId]);

    useEffect(() => {
        fetchImagesByUser(userId);
    }, [userId]);

    const fetchImagesByUser = async (userId: string) => {
        try {
            const response = await axios.get(`http://localhost:3003/api/getimage/${userId}`);
            setImage(response.data);
        } catch (error) {
            console.error('Error fetching images by user', error);
        }
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="dropdown">
            {isOpen && (
                <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={onAccountDetails} >
                        <span className="icons">
                            <BsPersonBoundingBox />
                        </span>
                        Change Profile Image
                    </button>
                    <button className="dropdown-item" onClick={onLogout}>
                        <span className="icons">
                            <ImExit />
                        </span>
                        Sign Out
                    </button>
                </div>
            )}
            <button className="dropdown-toggle" onClick={toggleMenu}>
                {image?.data ? (
                    <img className="profileimage" src={`data:image/jpeg;base64,${image?.data}`} alt={image?.name} />
                ) : (
                    <img src={ProfileImage} alt="ProfileImage" className="profileimage" />
                )}

                {user?.name ? (
                   <span>{user?.name} {user?.lastName}</span> 
                ) : (
                    <span>Name</span>
                )}
            </button>
        </div>
    );
};

export default DropdownMenu;
