import { Calendar, MapPin, ArrowRight, Copy } from 'lucide-react';
import { Card, CardMedia, CardContent, Typography, Button, Box, Chip } from '@mui/material';

const TripCard = ({ trip, onClick, onClone }) => {
  const startDate = trip.start_date ? new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD';
  const endDate = trip.end_date ? new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <Card 
      onClick={onClick}
      className="group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-0 bg-white"
      sx={{ borderRadius: '16px', position: 'relative' }}
    >
      <div className="relative h-48 overflow-hidden">
        <CardMedia
          component="img"
          height="192"
          image={trip.cover_image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'}
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
        <div className="absolute top-3 right-3">
             <Chip label={trip.visibility === '1' ? 'Public' : 'Private'} size="small" sx={{ bgcolor: 'white', color: 'black', fontWeight: 'bold' }} />
        </div>
      </div>

      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
            <Typography variant="h6" className="font-bold text-gray-800 leading-tight group-hover:text-primary transition-colors">
            {trip.title}
            </Typography>
        </div>
        
        <Box display="flex" alignItems="center" className="text-gray-500 mb-3 text-sm">
           <Calendar size={14} className="mr-1 text-secondary" />
           {startDate} - {endDate}
        </Box>

        <Typography variant="body2" color="text.secondary" className="line-clamp-2 mb-4 h-10">
          {trip.description || 'No description provided.'}
        </Typography>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
             <Box display="flex" alignItems="center">
                {/* Placeholder for collaborator avatars */}
             </Box>
             <div className="flex gap-2">
                  {onClone && trip.visibility === '1' && (
                     <Button 
                        size="small" 
                        startIcon={<Copy size={16} />}
                        onClick={(e) => { e.stopPropagation(); onClone(trip); }}
                        sx={{ textTransform: 'none', color: '#10b981', borderColor: '#10b981' }}
                     >
                        Add
                     </Button>
                  )}
                 <Button 
                    size="small" 
                    endIcon={<ArrowRight size={16} />}
                    sx={{ textTransform: 'none', fontWeight: 'bold', color: '#3B82F6' }}
                 >
                    View
                 </Button>
             </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripCard;
