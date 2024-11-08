"use client"
// Import statements (use your actual import paths)
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { Tabs } from 'antd';
import { RiSendPlaneLine } from 'react-icons/ri';
import { FaLessThanEqual, FaMicrophone } from 'react-icons/fa';
import { MdDeleteOutline, MdOutlineAttachFile } from 'react-icons/md';
import { settingsData } from "@/store/reducer/settingsSlice";
import { deleteChatMessagesApi, getChatsListApi, getChatsMessagesApi, sendMessageApi } from '@/store/actions/campaign';
import No_Chat from "../../../public/no_chat_found.svg"
import { placeholderImage, translate } from '@/utils';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { newchatData, removeChat } from '@/store/reducer/momentSlice';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import toast from 'react-hot-toast';
import moment from 'moment';
import { TfiReload } from "react-icons/tfi";
import CustomLightBox from './CustomLightBox';


const { TabPane } = Tabs;

const ChatApp = ({ notificationData }) => {                                                                                                                                                     

    const chatDisplayRef = useRef(null);

    const router = useRouter();

    const DummyImgData = useSelector(settingsData);

    const isLoggedIn = useSelector((state) => state.User_signup);

    const storedChatData = useSelector(newchatData)

    const PlaceHolderImg = DummyImgData?.web_placeholder_logo;

    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;

    const signupData = isLoggedIn?.data?.data;

    const newChatData = storedChatData;

    const [chatList, setChatList] = useState([]);

    const initialState = chatList.reduce((acc, chat) => {
        acc[chat.property_id] = {
            messageInput: '',
            showVoiceButton: true,
            selectedFile: null,
            recording: false,
            mediaRecorder: null,
            audioChunks: [],
            messages: [],
            ...(storedChatData && storedChatData[chat.property_id] ? storedChatData[chat.property_id] : {}),
        };
        return acc;
    }, {});

    const [tabStates, setTabStates] = useState((prev) => {
        return Object.keys(prev ?? {}).length === 0 ? initialState : prev;
    });

    const [isRecording, setIsRecording] = useState(false);

    const [selectedTab, setSelectedTab] = useState(null);

    const [chatMessages, setChatMessages] = useState([]);

    const [activeTabKey, setActiveTabKey] = useState(newChatData ? newChatData?.property_id : "");

    const [selectedFilePreview, setSelectedFilePreview] = useState(null);

    const [selectedFilePreviewName, setSelectedFilePreviewName] = useState("");

    const [currentPage, setCurrentPage] = useState(0);

    const [perPage, setPerPage] = useState(10);

    const [lastMessageTimestamp, setLastMessageTimestamp] = useState({});

    const [loadingMore, setLoadingMore] = useState(false);

    const [lightboxOpen, setLightboxOpen] = useState(false);

    const [currentImage, setCurrentImage] = useState([]);

    const [isSend, setIsSend] = useState(false)

    // Helper function
    const scrollToBottom = useCallback(() => {
        if (chatDisplayRef.current) {
            const chatDisplay = chatDisplayRef.current;
            const isScrolledToBottom = chatDisplay.scrollHeight - chatDisplay.clientHeight <= chatDisplay.scrollTop + 1;

            chatDisplay.classList.add('smooth-scroll');
            chatDisplay.scrollTop = chatDisplay.scrollHeight;

            // Remove the smooth-scroll class after animation
            setTimeout(() => {
                chatDisplay.classList.remove('smooth-scroll');
            }, 1000); // Adjust this timeout to match your CSS transition duration
        }
    }, []);

    const handleTabChange = (tabKey) => {
        const selectedChat = chatList.find(chat => chat.property_id === Number(tabKey));
        setSelectedTab(selectedChat);

        setTabStates(prevState => ({
            ...prevState,
            [tabKey]: {
                ...(prevState[tabKey] || {}),
                messageInput: '',
                showVoiceButton: true,
                selectedFile: null,
                recording: false,
                mediaRecorder: null,
                audioChunks: [],
                messages: [],
            },
        }));

        setActiveTabKey((prevKey) => {
            if (prevKey !== tabKey) {
                setCurrentPage(1);
                fetchLatestChat(selectedChat);
            }
            return tabKey;
        });
    };

    const handleInputChange = (tabKey, value) => {
        setTabStates((prevState) => ({
            ...prevState,
            [tabKey]: {
                ...prevState[tabKey],
                messageInput: value,
            },
        }));
    };

    const handleFileChange = (e, tabKey) => {
        const selectedFile = e.target.files[0];
        setTabStates((prevState) => ({
            ...prevState,
            [tabKey]: {
                ...prevState[tabKey],
                selectedFile: selectedFile,
            },
        }));
        setSelectedFilePreviewName(selectedFile.name)
        // Update the selected file preview
        setSelectedFilePreview(selectedFile);
    };

    const handleFileCancel = (tabKey) => {
        // Reset the value of the file input to trigger the change event again
        const fileInput = document.getElementById(`fileInput-${tabKey}`);
        if (fileInput) {
            fileInput.value = '';
        }

        setTabStates((prevState) => ({
            ...prevState,
            [tabKey]: {
                ...prevState[tabKey],
                selectedFile: null,
            },
        }));
        setSelectedFilePreview(null);
        setSelectedFilePreviewName("")

    };

    const handleAttachmentClick = (tabKey) => {
        document.getElementById(`fileInput-${tabKey}`).click();
    };

    const startRecording = async (tabKey) => {
        try {
            // Check if any audio input devices are available
            const devices = await navigator.mediaDevices.enumerateDevices();
            const hasAudioInput = devices.some(device => device.kind === 'audioinput');

            if (!hasAudioInput) {
                Swal.fire({
                    title: translate("noMicroPhoneFound"),
                    text: translate("pleaseConnectAMircoPhone"),
                    icon: 'warning',
                    confirmButtonText: translate("ok"),
                });
                return;
            }

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const mediaRecorder = new MediaRecorder(stream);
            let audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                setTabStates((prevState) => ({
                    ...prevState,
                    [tabKey]: {
                        ...(prevState[tabKey] || {}),
                        audioChunks: [...(prevState[tabKey]?.audioChunks || []), ...audioChunks],
                    },
                }));
            };

            mediaRecorder.start();
            setTabStates((prevState) => ({
                ...prevState,
                [tabKey]: {
                    ...(prevState[tabKey] || {}),
                    recording: true,
                    mediaRecorder: mediaRecorder,
                },
            }));
            setIsRecording(true);
        } catch (error) {
            console.log("error", error);
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                // Handle permission denied error
                Swal.fire({
                    title: translate("permissionDenied"),
                    text: translate("pleaseConnectAMircoPhone"),
                    icon: 'warning',
                    confirmButtonText: translate("ok"),
                });
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                // Handle no microphone found error
                Swal.fire({
                    title: translate("noMicroPhoneFound"),
                    text: translate("pleaseConnectAMircoPhone"),
                    icon: 'warning',
                    confirmButtonText: translate("ok"),
                });
            } else {
                toast.error(translate("permissionDenyForMic"));
            }
        }
    };

    const stopRecording = (tabKey) => {
        if (tabStates[tabKey]?.mediaRecorder) {
            tabStates[tabKey]?.mediaRecorder.stop();
            setTabStates((prevState) => ({
                ...prevState,
                [tabKey]: {
                    ...prevState[tabKey],
                    recording: false,
                },
            }));
            setIsRecording(false);
        }
    };

    const handleMouseMove = (tabKey) => {
        if (isRecording) {

        }
    };

    const handleSendClick = (tabKey) => {
        const tabState = tabStates[tabKey] || {};
        const hasText = tabState.messageInput?.trim();
        const hasFile = tabState.selectedFile || (tabState.audioChunks && tabState.audioChunks.length > 0);

        let messageType;

        if (hasText && hasFile) {
            messageType = 'file_and_text';
        } else if (hasText) {
            messageType = 'text';
        } else if (hasFile) {
            messageType = tabState.selectedFile ? 'file' : 'audio';
        } else {
            // If neither message input nor file attachment is present, return early
            toast.error(translate("enterChatMessage"));
            return;
        }

        // Check if the message input is empty for text messages
        if (messageType === 'text' && !tabState.messageInput?.trim()) {
            toast.error(translate("enterChatMessage"));
            return;
        }

        // show loader
        setIsSend(true)

        let newMessage = {
            sender_id: userCurrentId,
            receiver_id: selectedTab.user_id,
            property_id: selectedTab.property_id,
            chat_message_type: messageType,
            message: tabState.messageInput,
            file: tabState.selectedFile,
            audio: tabState.audioChunks,
            created_at: new Date().toISOString(),
        };


        sendMessageApi(
            newMessage.sender_id,
            newMessage.receiver_id,
            newMessage.message ? newMessage.message : newMessage.file ? '' : newMessage.audio ? '' : '',
            newMessage.property_id,
            newMessage.file ? newMessage.file : "",
            newMessage.audio ? newMessage.audio : "",
            (res) => {


                if (messageType === 'audio' && tabState.audioChunks.length > 0) {
                    const audioBlob = new Blob(tabState.audioChunks, { type: 'audio/webm;codecs=opus' });
                    const audioFile = new File([audioBlob], 'audio_message.webm', { type: 'audio/webm;codecs=opus' });
                    newMessage = {
                        ...newMessage,
                        audio: audioFile,
                    };
                }

                setTabStates((prevState) => ({
                    ...prevState,
                    [tabKey]: {
                        ...prevState[tabKey],
                        messages: [...(prevState[tabKey]?.messages || []), newMessage],
                        messageInput: '',
                        selectedFile: null,
                        audioChunks: [],
                    },
                }));
                setChatMessages((prevMessages) => [...prevMessages, newMessage]);
                setIsSend(false)
                setSelectedFilePreview(null);
                // setTimeout(() => {
                scrollToBottom();
                // }, 0);
            },
            (error) => {
                console.log(error)
                toast.error(error)
                setIsSend(false)

            }


        )
    };

    const fetchMoreMessages = () => {
        if (loadingMore) {
            return;
        }
        setLoadingMore(true);

        getChatsMessagesApi({
            property_id: selectedTab?.property_id,
            page: currentPage + 1, // Increment the page number
            per_page: perPage,
            onSuccess: (res) => {
                const apiMessages = res.data.data || [];
                const userMessages = tabStates[selectedTab.property_id]?.messages || [];
                const combinedMessages = [...apiMessages, ...userMessages];
                const sortedMessages = combinedMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

                setChatMessages((prevMessages) => [...sortedMessages, ...prevMessages]);
                setCurrentPage(currentPage + 1);
                setLoadingMore(false);
            },
            onError: (err) => {
                toast.error(err?.message);
                setLoadingMore(false);
            }
        }
        );
    };

    const formatTimeDifference = (timestamp) => {
        const now = moment();
        const messageTime = moment(timestamp);
        const diffInSeconds = now.diff(messageTime, 'seconds');

        if (diffInSeconds < 1) {
            return '1s ago';
        } else if (diffInSeconds < 60) {
            return `${diffInSeconds}s ago`;
        } else if (diffInSeconds < 3600) {
            return `${Math.floor(diffInSeconds / 60)}m ago`;
        } else if (diffInSeconds < 86400) {
            return `${Math.floor(diffInSeconds / 3600)}h ago`;
        } else {
            return messageTime.format('h:mm A');
        }
    };

    const handleOpenLightbox = useCallback((image) => {
        setCurrentImage(image)
        setLightboxOpen(true);
    }, []);

    const handleCloseLightbox = useCallback(() => {
        setLightboxOpen(false);
    }, []);

    const handleDeleteChat = () => {
        if (!selectedTab) {
            console.error("No chat selected for deletion");
            return;
        }

        const chatToDelete = { ...selectedTab }; // Create a copy of selectedTab

        Swal.fire({
            title: translate("areYouSure"),
            text: translate("areYouSureDeleteChat"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: translate("yesDelete"),
            cancelButtonText: translate("noDelete"),
            reverseButtons: true,
            customClass: {
                confirmButton: 'Swal-confirm-buttons',
                cancelButton: "Swal-cancel-buttons"
            },
        }).then((result) => {
            if (result.isConfirmed) {
                deleteChatMessagesApi(
                    userCurrentId,
                    chatToDelete.user_id,
                    chatToDelete.property_id,
                    (res) => {
                        Swal.fire({
                            title: translate("deleted"),
                            text: res.message,
                            icon: "success",
                            customClass: {
                                confirmButton: 'Swal-confirm-buttons',
                                cancelButton: "Swal-cancel-buttons"
                            },
                        });

                        // Remove the deleted chat from state
                        setChatList(prevList => {
                            const newList = prevList.filter(chat => chat.property_id !== chatToDelete.property_id);

                            // Select the next available chat
                            if (newList.length > 0) {
                                const nextChat = newList[0];
                                setSelectedTab(nextChat);
                                setActiveTabKey(nextChat.property_id.toString());

                                // Fetch messages for the newly selected chat
                                fetchLatestChat(nextChat);
                            } else {
                                setSelectedTab(null);
                                setActiveTabKey("");
                                setChatMessages([]);
                            }

                            return newList;
                        });

                        setTabStates((prevStates) => {
                            const newState = { ...prevStates };
                            delete newState[chatToDelete.property_id];
                            return newState;
                        });

                        if (chatToDelete.property_id === newChatData?.property_id) {
                            removeChat();
                        }

                        if (chatList.length === 1) {
                            // Navigate to home page if this was the last chat
                            router.push("/");
                        }
                    },
                    (error) => {
                        console.error("Error deleting chat:", error);
                        toast.error(translate("errorDeletingChat"));
                    }
                );
            }
        });
    };

    const handleReloadChat = () => {
        if (selectedTab) {
            fetchLatestChat(selectedTab);
        }
    };

    const renderMessage = (message, index) => {
        const imageExtensions = ['png', 'jpg', 'jpeg'];
        const documentExtensions = ['pdf', 'doc', 'docx'];

        const isFile = message.chat_message_type === 'file';
        const isAudio = message.chat_message_type === 'audio';
        const isText = message.chat_message_type === 'text';
        const isFileAndText = message.chat_message_type === 'file_and_text';

        const isImage =
            message.file &&
            (typeof message.file === 'string' && imageExtensions.some((ext) => message.file.endsWith(`.${ext}`))) ||
            (message.file instanceof File && imageExtensions.some((ext) => message.file.name.endsWith(`.${ext}`)));

        const isDocument =
            message.file &&
            (typeof message.file === 'string' && documentExtensions.some((ext) => message.file.endsWith(`.${ext}`))) ||
            (message.file instanceof File && documentExtensions.some((ext) => message.file.name.endsWith(`.${ext}`)));

        const renderFile = (file) => {
            if (isImage) {
                // Render image file preview
                return (
                    <div className="file-preview">
                        <img src={message.file instanceof File ? URL.createObjectURL(file) : file} alt="File Preview" onClick={() => handleOpenLightbox(message.file instanceof File ? URL.createObjectURL(file) : file)} />
                        {message.message && <span>{message.message}</span>}
                    </div>
                );
            } else if (isDocument) {
                // Render document file name with link
                const fileName = message.file instanceof File ? message.file.name : file.split('/').pop();
                return (
                    <div className="file-preview">
                        <span onClick={() => window.open(file instanceof File ? URL.createObjectURL(file) : file, '_blank')} className="file-name">
                            {fileName}
                        </span>
                        {message.message && <span>{message.message}</span>}
                    </div>
                );
            }
            return null;
        };

        return (
            <div key={index} className={message.sender_id === userCurrentId ? 'user-message' : 'other-message'}>
                {/* Render Audio Messages */}
                {isAudio && (
                    <div className={message.sender_id === userCurrentId ? 'user-audio' : 'other-audio'}>
                        {typeof message.audio === 'string' ? (
                            <audio controls>
                                <source src={message.audio} type="audio/webm;codecs=opus" />
                                Your browser does not support the audio element.
                            </audio>
                        ) : message.audio && message.audio instanceof File && message.audio.type.startsWith('audio/') ? (
                            <audio controls>
                                <source src={URL.createObjectURL(message.audio)} type="audio/webm;codecs=opus" />
                                Your browser does not support the audio element.
                            </audio>
                        ) : null}
                    </div>
                )}

                {/* Render File Messages */}
                {isFile && message.file ? renderFile(message.file) : null}

                {/* Render Text Messages */}
                {isText && (
                    <span className="text-message">
                        {message.message}
                    </span>
                )}

                {/* Render File and Text Messages */}
                {isFileAndText && message.file && (
                    <div>
                        {renderFile(message.file)}
                    </div>
                )}
            </div>
        );
    };

    // api cales 
    useEffect(() => {
        if (signupData?.data === null) {
            router.push("/");
        }
    }, [signupData])

    useEffect(() => {
        if (notificationData) {
            const newMessage = {
                sender_id: notificationData.sender_id,
                receiver_id: notificationData.receiver_id,
                property_id: notificationData.property_id,
                chat_message_type: notificationData.chat_message_type,
                user_profile: notificationData?.user_profile,
                message: notificationData.message,
                file: notificationData.file,
                audio: notificationData.audio,
                created_at: notificationData.created_at,
            };

            setTabStates((prevState) => ({
                ...prevState,
                [notificationData.property_id]: {
                    ...prevState[notificationData.property_id],
                    messages: [...(prevState[notificationData.property_id]?.messages || []), newMessage],
                },
            }));

            setChatMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, newMessage];
                // Scroll to bottom after fetching messages
                setTimeout(scrollToBottom, 0);
                return updatedMessages;
            });
        }
    }, [notificationData]);

    useEffect(() => {
        getChatsListApi({
            onSuccess: (res) => {
                // Update chatList with the fetched data
                setChatList(res.data);
                // If there's storedChatData and it has property_id, set it as the default active tab
                if (storedChatData) {
                    // Check if the chat with the same property_id already exists in the chatList
                    if (!res.data.some(chat => chat.property_id === newChatData.property_id)) {
                        // Update chatList with the newChatData at the beginning
                        setChatList(prevList => [newChatData, ...prevList]);
                    }
                    setSelectedTab(newChatData);
                    // Set the active tab key to the newChatData's property_id
                    setActiveTabKey(newChatData.property_id);
                } else {
                    // Set the selected tab to the first chat in the list
                    setSelectedTab(res.data[0]);
                    setActiveTabKey(res.data[0].property_id);
                }
            },
            onError: (err) => {
                console.log(err);
            }
        }
        );
    }, [storedChatData]);

    const fetchLatestChat = (selectedTab) => {
        const lastTimestamp = lastMessageTimestamp[selectedTab.property_id] || 0;

        getChatsMessagesApi({
            property_id: selectedTab?.property_id,
            page: 0,
            per_page: 10,
            onSuccess: (res) => {
                const apiMessages = res.data.data || [];
                const newMessages = apiMessages.filter(msg => new Date(msg.created_at).getTime() > lastTimestamp);

                setChatMessages(prevMessages => {
                    const updatedMessages = [...prevMessages, ...newMessages];
                    const uniqueMessages = Array.from(new Set(updatedMessages.map(m => m.created_at)))
                        .map(date => updatedMessages.find(m => m.created_at === date))
                        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

                    return uniqueMessages;
                });

                setCurrentPage(1);
                setLoadingMore(false);
                scrollToBottom();

                // Update last message timestamp
                if (newMessages.length > 0) {
                    setLastMessageTimestamp(prev => ({
                        ...prev,
                        [selectedTab.property_id]: new Date(newMessages[newMessages.length - 1].created_at).getTime()
                    }));
                }
            },
            onError: (err) => {
                toast.error(err);
                setLoadingMore(false);
            }
        }
        );
    };

    useEffect(() => {
        if (selectedTab) {
            getChatsMessagesApi({
                property_id: selectedTab?.property_id,
                page: currentPage,
                per_page: perPage,
                onSuccess: (res) => {
                    const apiMessages = res.data.data || [];
                    const userMessages = tabStates[selectedTab.property_id]?.messages || [];
                    const combinedMessages = [...apiMessages, ...userMessages];
                    const sortedMessages = combinedMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                    setChatMessages(sortedMessages);
                    setCurrentPage(currentPage + 1);
                    setLoadingMore(false);
                },
                onError: (err) => {
                    toast.error(err);
                    setLoadingMore(false);
                }
            });
        }
    }, [selectedTab]);


    useEffect(() => {
        const chatDisplay = chatDisplayRef?.current;

        const handleScroll = () => {
            // Check if the user has scrolled to the top
            if (chatDisplay.scrollTop === 0) {
                fetchMoreMessages();
            }
        };

        if (chatDisplayRef.current) {
            chatDisplayRef.current.addEventListener('scroll', handleScroll);
        }

        // Clean up the event listener when the component unmounts
        return () => {
            if (chatDisplayRef.current) {
                chatDisplayRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [selectedTab, currentPage, loadingMore]);

    useEffect(() => { }, [selectedTab, activeTabKey, selectedFilePreview, chatMessages])

    return (
        <>
            <div className='messages'>
                <div className="container">
                    <div className="dashboard_titles">
                        <h3>{translate("messages")}</h3>
                    </div>
                    <div className="card">
                        {chatList?.length > 0 && chatList !== "" ? (
                            <Tabs defaultActiveKey={activeTabKey} tabPosition="left" onChange={handleTabChange}>
                                {chatList.map((chat) => (
                                    <TabPane
                                        key={chat.property_id}
                                        tab={
                                            <div className="message_list_details">
                                                <div className="profile_img">
                                                    <Image loading="lazy" id="profile" src={chat?.profile ? chat?.profile : PlaceHolderImg} alt="no_img" width={0} height={0} onError={placeholderImage} />
                                                </div>
                                                <div className="profile_name">
                                                    <span className='user_name'>
                                                        {chat?.name}
                                                    </span>
                                                    <span className='property_title'>
                                                        {chat?.title}
                                                    </span>
                                                </div>

                                            </div>
                                        }
                                    >
                                        <div className="chat_deatils">
                                            <div className="chat_deatils_header">
                                                <div className="profile_img_name_div">
                                                    <div className="chat_profile_div">
                                                        <Image loading="lazy" id="chat_profile" src={chat?.title_image ? chat?.title_image : PlaceHolderImg} alt="no_img" width={0} height={0} onError={placeholderImage} />
                                                    </div>
                                                    <div className="profile_name">
                                                        <span className='user_name'>
                                                            {chat?.name}
                                                        </span>
                                                        <span className='property_title'>
                                                            {chat?.title}
                                                        </span>
                                                    </div>
                                                </div>
                                                {chatMessages.length > 0 && (
                                                    <div className='right_icons'>
                                                        <div className="delete_messages" onClick={handleDeleteChat}>
                                                            <span><MdDeleteOutline size={22} /></span>
                                                        </div>
                                                        <div className="reload_messages" onClick={() => handleReloadChat()}>
                                                            <span><TfiReload size={18} /></span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="chat_display" ref={chatDisplayRef}>
                                                <div className='sender_masg'>
                                                    {chatMessages.length > 0 ? (
                                                        chatMessages.map((message, index) => (
                                                            <>
                                                                <div key={index} className={message.sender_id === userCurrentId ? 'user-message' : 'other-message'}>
                                                                    {renderMessage(message, index)}

                                                                </div>
                                                                <div className={message.sender_id === userCurrentId ? 'user-message-time' : 'other-message-time'}>
                                                                    <span className='chat_time'>{formatTimeDifference(message.created_at)}</span>
                                                                </div>
                                                            </>

                                                        ))
                                                    ) : (
                                                        <div className="col-12 text-center" id='noChats'>
                                                            <div>
                                                                <Image loading="lazy" src={No_Chat.src} alt="start_chat" width={250} height={250} onError={placeholderImage} />
                                                            </div>
                                                            <div className='no_page_found_text'>
                                                                <h3>{translate("startConversation")}</h3>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>

                                                </div>
                                            </div>

                                            {selectedFilePreview && (
                                                <div className="file-preview-section">
                                                    <>
                                                        {selectedFilePreview.type.startsWith('image/') ? (
                                                            <img src={URL.createObjectURL(selectedFilePreview)} alt={selectedFilePreview.name} />
                                                        ) : (
                                                            <span>{selectedFilePreview.name}</span>
                                                        )}
                                                        <button className="change-button" onClick={() => handleFileCancel(chat.property_id)}>
                                                            <IoMdCloseCircleOutline size={35} />
                                                        </button>
                                                    </>
                                                </div>
                                            )}

                                            <div className="chat_inputs">
                                                <div
                                                    className="attechment"
                                                    onClick={() => handleAttachmentClick(chat.property_id)}
                                                >
                                                    <MdOutlineAttachFile size={20} />
                                                    <input
                                                        type="file"
                                                        id={`fileInput-${chat.property_id}`}
                                                        onChange={(e) => handleFileChange(e, chat.property_id)}
                                                    />
                                                </div>
                                                <div className="type_input">
                                                    <input
                                                        type="text"
                                                        placeholder={translate("typeYourMessage")}
                                                        value={tabStates[chat.property_id]?.messageInput}
                                                        onChange={(e) => handleInputChange(chat.property_id, e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault(); // Prevents a new line in the input field
                                                                handleSendClick(chat.property_id);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    className="hide-attechment"
                                                    onClick={() => handleAttachmentClick(chat.property_id)}
                                                >
                                                    <MdOutlineAttachFile size={20} />
                                                    <input
                                                        type="file"
                                                        id={`fileInput-${chat.property_id}`}
                                                        onChange={(e) => handleFileChange(e, chat.property_id)}
                                                    />
                                                </div>
                                                {tabStates[chat.property_id]?.recording ? (
                                                    <button
                                                        className={`voice_message recording`}
                                                        onMouseDown={() => startRecording(chat.property_id)}
                                                        onMouseUp={() => stopRecording(chat.property_id)}
                                                        onMouseMove={() => handleMouseMove(chat.property_id)}
                                                    >
                                                        <FaMicrophone size={30} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="voice_message"
                                                        onMouseDown={() => startRecording(chat.property_id)}
                                                        onMouseUp={() => stopRecording(chat.property_id)}
                                                        onMouseMove={() => handleMouseMove(chat.property_id)}
                                                    >
                                                        <FaMicrophone size={20} />
                                                    </button>
                                                )}
                                                <button
                                                    type='submit'
                                                    className="send_message"
                                                    disabled={isSend}
                                                    style={{ cursor: isSend ? 'not-allowed' : 'pointer' }}
                                                    onClick={() => handleSendClick(chat.property_id)}
                                                >
                                                    {isSend ? (
                                                        // Show loader when isSend is true
                                                        <div className='loader-container-otp'>
                                                            <div className="loader-otp"></div>
                                                        </div>
                                                    ) : (
                                                        // Show send text and icon when isSend is false
                                                        <>
                                                            <span> {translate("send")} </span>
                                                            <RiSendPlaneLine size={20} />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                    </TabPane>
                                ))}
                            </Tabs>
                        ) : (
                            <div className="col-12 text-center" id='noChats'>
                                <div>
                                    <Image loading="lazy" src={No_Chat.src} alt="no_chats" width={450} height={450} onError={placeholderImage} />
                                </div>
                                <div className='no_page_found_text'>
                                    <h3>{translate("noChat")}</h3>

                                </div>
                            </div>
                        )}

                    </div>



                </div>
            </div>
            <CustomLightBox lightboxOpen={lightboxOpen} handleCloseLightbox={handleCloseLightbox} currentImage={currentImage} />
        </>
    );
};

export default ChatApp;
