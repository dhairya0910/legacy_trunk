import React from "react";
import { motion } from "framer-motion";
import { Users, MessageCircle, X } from "lucide-react";
import { useEffect } from "react";
import config from "../config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function FamilyContactsSidebar({ familyName,members, onContactClick, isOpen, onClose }) {
  const [storiesData,setStoriesData] = useState([])
  const pushStory = [];
  const navigate = useNavigate();
  const fetchMembersStatus = async()=>{
    for(let member of members){
    
     try {
          const res = await fetch(`${config.BACKEND_URL}/get-stories/${member.id}`);
          const data = await res.json();
          pushStory.push({stories:data.stories||[]})
          console.log(storiesData)
        
        } catch (err) {
          console.error("Error fetching for:", member._id, err);
          
        }
    }
  }


  const checkStatus = (id) =>{
    navigate(`/${id}/view-stories`)
  }

  useEffect( () => {
    fetchMembersStatus();
    setStoriesData(pushStory)
  }, [members])
  


  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed lg:relative inset-y-0 left-0 z-50 w-80 lg:w-full bg-white/80 backdrop-blur-xl border-r border-green-200/50 shadow-xl lg:shadow-none lg:translate-x-0"
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-green-200/50 bg-gradient-to-br from-emerald-50 to-green-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">{familyName}</h2>
                  <p className="text-sm text-gray-500">{members.length} members</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
                onClick={() => onContactClick(member)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 cursor-pointer transition-all duration-200 group"
              >
                <div className="relative">
                  <div onClick={()=>checkStatus(member.id)} className="w-14 h-14 bg-gradient-to-tr from-[#544364] to-pink-100 shadow-[0_20px_50px_rgba(236,72,153,0.4)] rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-md"style={{
            
            boxShadow:
              storiesData[index]?.stories?.length > 0
                ? "0px 0px 10px #450081 "
                : "2px solid transparent",
           
          }}>
                    {member.avatar_url ? (
                      <img
                        src={member.avatar_url}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-lg">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate group-hover:text-emerald-600 transition-colors">
                    {member.name}
                  </h3>
                 
                </div>

                <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.aside>
    </>
  );
}