import EventCard from "@/components/EventCard";
import EventList from "@/components/EventList";
import { EventType } from "@/lib/types";

type CategoryData = {
  id: string;
  category: string;
  event: EventType[];
}[];

var hide = true;

export default async function Events() {
  const categoryData: CategoryData = [];
  const response = await fetch('http://localhost:3000/api/events/getEventsByCategory', {
    method: 'GET',
    headers: {
      "Content-type": "application/json"
    },
  });
  if (response.ok) {
    const data = await response.json()
    //console.log("response ok ", data.data)
    const categories = data.data;

    if (data.error) {
      hide = false;
    }
    try {
      for (const i in categories) {
        //console.log(categories[i])
        const newCat = {
          id: crypto.randomUUID(),
          category: categories[i]._id,
          event: categories[i].documents
        }
        categoryData.push(newCat)
      }
      console.log(categoryData)
      // for (const event of data.data) {
      //   const categories = event.category;
      //   for (const category of categories) {
      //     const existingCategory = categoryData.find(cat => cat.category === category);
      //     if (existingCategory) {
      //       existingCategory.event.push(event);
      //     } else {
      //       const newCat = {
      //         id: uuid(),
      //         category: category,
      //         event: [event]
      //       }
      //       categoryData.push(newCat)
      //     }

      //   }
      // }
    } catch (err) {
      console.log(err)
    }
  } else {
    hide = false;
  }
  return (
    <>
      <div className="flex flex-col gap-2 bg-lime-200">
        <p className="text-4xl font-bold">Categories: </p>
        {hide && categoryData.map((cat) => (
          <EventList category={cat.category} key={cat.id}>
            {cat.event.map((event) => {
              return (
                <EventCard
                  key={event.id}
                  id={event.id}
                  eventName={event.eventName}
                  date={new Date(event.eventStartDate)}
                  location={event.location}
                  img={event.imgPoster}
                  views={event.weeklyViews}
                />
              )
            }
            )}
          </EventList>
        )
        )}

        {!hide && (<EventList category="Test404Category">
          <EventCard
            id="Testing404Event"
            eventName="Testing404Event"
            date={new Date()}
            location="Click to test 404 event"
            img="https://picsum.photos/id/1/200/150"
            views={0}
          />
        </EventList>)}
      </div>
    </>
  );
}
