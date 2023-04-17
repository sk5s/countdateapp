package cyou.sk5s.app.countdate;

import static cyou.sk5s.app.countdate.CountdateWidgetConfig.KEY_DATE_PREFIX;
import static cyou.sk5s.app.countdate.CountdateWidgetConfig.KEY_NAME_PREFIX;
import static cyou.sk5s.app.countdate.CountdateWidgetConfig.SHARED_PREFS;

import android.annotation.SuppressLint;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class CountdateWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds){
        for (int appWidgetId : appWidgetIds){
            Intent intent = new Intent(context, MainActivity.class);
            PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE);

            SharedPreferences prefs = context.getSharedPreferences(SHARED_PREFS,Context.MODE_PRIVATE);
            String eventName = prefs.getString(KEY_NAME_PREFIX + appWidgetId,"No Data");
            String eventDate = prefs.getString(KEY_DATE_PREFIX + appWidgetId,"");

            String numOfDays = "";
            String countdownup = "Countdown";
            String[] parts = eventDate.split("T");
            numOfDays = "";
            try {
                Date today = new Date();
                Date anotherDate = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).parse(parts[0]);
                //numOfDays = String.valueOf(today.getTime()) + String.valueOf(anotherDate.getTime());
                if (anotherDate.getTime() > 0){
                    long difference = anotherDate.getTime() - today.getTime();
                    if (difference > 0){
                        numOfDays = String.valueOf((int) (difference / (1000 * 60 * 60 * 24)) + 1);
                    } else {
                        numOfDays = String.valueOf((int) (-difference / (1000 * 60 * 60 * 24)) - 1);
                        countdownup = "Countup";
                    }
                }
            } catch (ParseException e) {
                e.printStackTrace();
            }

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.countdate_widget);
            views.setOnClickPendingIntent(R.id.countdate_widget_text1, pendingIntent);
            views.setCharSequence(R.id.countdate_widget_text1,"setText", eventName+" "+countdownup);
            views.setCharSequence(R.id.countdate_widget_text2,"setText", numOfDays);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}
